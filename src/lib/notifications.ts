import { prisma } from './prisma'

export type NotificationType = 'ORDER_UPDATE' | 'MESSAGE' | 'PAYMENT' | 'REVIEW' | 'SYSTEM' | 'APPLICATION' | 'INTERVIEW'

interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type: NotificationType
  entityId?: string
  entityType?: string
  metadata?: any
}

export async function createNotification({
  userId,
  title,
  message,
  type,
  entityId,
  entityType,
  metadata
}: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        entityId,
        entityType
      }
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return null
  }
}

export async function createOrderNotification(
  userId: string,
  orderId: string,
  status: string,
  customMessage?: string
) {
  const statusMessages = {
    PAID: 'Your order has been paid successfully',
    IN_PROGRESS: 'Your order is now in progress',
    DELIVERED: 'Your order has been delivered',
    COMPLETED: 'Your order has been completed',
    CANCELLED: 'Your order has been cancelled',
    DISPUTED: 'Your order is under dispute'
  }

  return createNotification({
    userId,
    title: 'Order Update',
    message: customMessage || statusMessages[status as keyof typeof statusMessages] || 'Order status updated',
    type: 'ORDER_UPDATE',
    entityId: orderId,
    entityType: 'order'
  })
}

export async function createPaymentNotification(
  userId: string,
  amount: number,
  status: 'SUCCESS' | 'FAILED',
  orderId?: string
) {
  return createNotification({
    userId,
    title: status === 'SUCCESS' ? 'Payment Successful' : 'Payment Failed',
    message: status === 'SUCCESS' 
      ? `Payment of KES ${amount} completed successfully`
      : `Payment of KES ${amount} failed. Please try again`,
    type: 'PAYMENT',
    entityId: orderId,
    entityType: 'order'
  })
}

export async function createReviewNotification(
  userId: string,
  rating: number,
  gigId: string
) {
  return createNotification({
    userId,
    title: 'New Review',
    message: `You received a ${rating}-star review on your gig`,
    type: 'REVIEW',
    entityId: gigId,
    entityType: 'gig'
  })
}

export async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  try {
    return await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId
      },
      data: { isRead: true }
    })
  } catch (error) {
    console.error('Failed to mark notifications as read:', error)
    return null
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    })
  } catch (error) {
    console.error('Failed to get unread notification count:', error)
    return 0
  }
}