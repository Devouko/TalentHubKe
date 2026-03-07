import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { escrowService } from '@/lib/escrow.service'

// Auto-release escrows past confirmation deadline
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Running auto-release job...')
  
  try {
    const escrows = await prisma.escrow_transactions.findMany({
      where: {
        status: 'DELIVERED',
        confirmationDeadline: { lt: new Date() }
      }
    })
    
    let released = 0
    for (const escrow of escrows) {
      try {
        await escrowService.autoRelease(escrow.id)
        released++
      } catch (error) {
        console.error(`Failed to auto-release ${escrow.id}:`, error)
      }
    }
    
    console.log(`[CRON] Auto-released ${released} escrows`)
  } catch (error) {
    console.error('[CRON] Auto-release job failed:', error)
  }
})

// Expire stale escrows
cron.schedule('0 2 * * *', async () => {
  console.log('[CRON] Running expire stale escrows job...')
  
  try {
    const count = await escrowService.expireStaleEscrows()
    console.log(`[CRON] Expired ${count} stale escrows`)
  } catch (error) {
    console.error('[CRON] Expire job failed:', error)
  }
})

console.log('[CRON] Escrow jobs scheduled')
