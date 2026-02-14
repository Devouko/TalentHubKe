const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3001

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)
  
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  const users = new Map()

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
      users.set(userId, socket.id)
      socket.userId = userId
      console.log(`User ${userId} joined`)
    })

    socket.on('send_message', (data) => {
      const { receiverId, message, senderId, orderId } = data
      const receiverSocketId = users.get(receiverId)
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          message,
          senderId,
          orderId,
          timestamp: new Date().toISOString()
        })
      }
      
      socket.emit('message_sent', { success: true })
    })

    socket.on('disconnect', () => {
      if (socket.userId) {
        users.delete(socket.userId)
        console.log(`User ${socket.userId} disconnected`)
      }
    })
  })

  httpServer.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})