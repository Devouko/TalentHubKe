const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

app.use(cors())

const connectedUsers = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', (data) => {
    socket.userId = data.userId
    socket.userName = data.userName
    connectedUsers.set(data.userId, socket.id)
    console.log(`User ${data.userName} joined with ID: ${data.userId}`)
  })

  socket.on('joinOrder', (orderId) => {
    socket.join(`order_${orderId}`)
    console.log(`User ${socket.userId} joined order room: ${orderId}`)
  })

  socket.on('leaveOrder', (orderId) => {
    socket.leave(`order_${orderId}`)
    console.log(`User ${socket.userId} left order room: ${orderId}`)
  })

  socket.on('sendMessage', (data) => {
    const message = {
      id: data.id,
      content: data.content,
      senderId: data.senderId,
      orderId: data.orderId,
      createdAt: data.createdAt,
      sender: data.sender
    }
    
    // Send to all users in the order room
    socket.to(`order_${data.orderId}`).emit('newMessage', message)
    console.log(`Message sent to order ${data.orderId}:`, message.content)
  })

  socket.on('typing', (data) => {
    socket.to(`order_${data.orderId}`).emit('userTyping', {
      userId: socket.userId,
      userName: socket.userName,
      isTyping: data.isTyping
    })
  })

  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId)
      console.log(`User ${socket.userId} disconnected`)
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})