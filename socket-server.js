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

const messages = []

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', (data) => {
    socket.userId = data.userId
    socket.userName = data.userName
    socket.emit('previousMessages', messages)
  })

  socket.on('sendMessage', (data) => {
    const message = {
      id: Date.now().toString(),
      text: data.text,
      userId: data.userId,
      userName: data.userName,
      timestamp: new Date()
    }
    messages.push(message)
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})