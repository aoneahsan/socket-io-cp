// // Imports
// const http = require('http')
// const socketIO = require('socket.io')

// // Constants
// const NODE_SERVER_PORT = 8000

// // Code Logic
// const nodeServer = http.createServer((req, res) => {
//   res.end("i'm connected.")
// })

// const _socketIoServer = socketIO(nodeServer)

// nodeServer.listen({
//   port: NODE_SERVER_PORT
// })

// _socketIoServer.on('connection', (_socket, req) => {
//   console.log({ message: 'new connection created', _socket })

//   _socket.emit('server-message', {
//     origin: 'server',
//     log: 'this message came from server'
//   })

//   _socket.on('any-key-will-do', message =>
//     console.log({ message, info: 'message received from client side' })
//   )
// })

// trying with express

// Imports
const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io').Server

// Constants
const NODE_SERVER_PORT = 5001

// Code Logic
const expressServer = express()

expressServer.use(cors())

expressServer.use(express.static(__dirname + '/public'))

const httpServer = expressServer.listen(NODE_SERVER_PORT, function () {
  console.log(`CORS-enabled web server listening on port ${NODE_SERVER_PORT}`)
})

const _socketIoServer = new socketIO(httpServer)

_socketIoServer.on('connection', (_socket, req) => {
  console.log({ message: 'new connection created' })

  _socket.emit('server-message', {
    origin: 'server',
    log: 'this message came from server'
  })

  _socket.on('any-key-will-do', message =>
    console.log({ message, info: 'message received from client side' })
  )

  _socket.on('newMessage_FromClient', message => {
    console.log({ newMessage_FromClient: message })
    _socketIoServer.emit('newMessage_FromServer', message.text)
  })
})
