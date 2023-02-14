// Imports
const _webSocket = require('ws')
const http = require('http')

// Constants
const NODE_SERVER_PORT = 5001

// Code Logic
const nodeServer = http.createServer((req, res) => {
  res.end("i'm connected.")
})

const _webSocketServer = new _webSocket.Server({
  server: nodeServer
})

nodeServer.listen({
  port: NODE_SERVER_PORT
})

// adding websocket server event listeners
_webSocketServer.on('headers', (_headers, req) => {
  console.log({ message: '_headers event', _headers })
})
_webSocketServer.on('connection', (_socket, req) => {
  // console.log({ message: 'connection event', _socket })

  // use this socket to send messages to client and etc
  _socket.send('a new message from server')

  _socket.on('open', e => {
    console.log({ message: 'open event listener on _socket.on', e })
  })

  _socket.on('close', e => {
    console.log({ message: 'close event listener on _socket.on', e })
  })

  _socket.on('message', e => {
    console.log({ message: 'message event listener on _socket.on', e })
  })

  _socket.on('ping', e => {
    console.log({ message: 'ping event listener on _socket.on', e })
  })
})
_webSocketServer.on('close', event => {
  console.log({ message: 'connection closed', event })
})
