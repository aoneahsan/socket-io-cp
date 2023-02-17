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

// by default any "." event we call on "_socketIoServer" gets called on "_socketIoServer.of('/')" mean default "/" namespace
_socketIoServer.on('connection', (_socket, req) => {
  console.log({ message: 'new connection created' })

  // here this socket is part of the namespace which was defined while checking the "connection" event, if no namespace was defined or if "/" namespace was defined in both cases it will become part of "/" namespace
  // the below one will send a message in "/" namespace which will be listen able in all rooms (if defined any), in "/" namespace
  _socket.emit('server-message', {
    origin: 'server',
    log: 'this message came from server'
  })

  // unlike the above one the emit method defined below will only send this message to "/zaions" room, in "/" namespace
  // other than ".to()", we can also use ".in()", both are same
  _socket
    .to('/zaions')
    .emit(
      'message for zaions room only',
      'message will only get received in zaions room.'
    )

  // to join a room in a namespace server need to add/join a socket when it gets connected (using "connection" event), by using ".join()" method
  // please note on client side, the socket connection object have no info about the rooms, it can only connect to a certain namespace, but once it's done, that's it, it can then only send messages in that namespace, it's server responsibility to add a socket connection in a room and then that socket (from server), can emit message in that room only or in whole namespace which it connected to from the client side
  // please note as the room name is {string}, so it does not matter if you provide "/zaions" or "zaions", as it will match the string when checking if the socket if part of that room or not, so "/zaions" is not same as "zaions"
  _socket.join('/zaions') // that is it this will add/join "_socket" (which connected from frontend/client) to this namespace, to "/zaions" room

  _socket.emit('key-name', 'message value') // this will emit this message in this whole namespace (in all it's rooms), and this "_socket" client will not receive this event

  _socket.to('/zaions').emit('key-name', 'message value') // this will emit this message in this namespace in "/zaions" room only, so only the "sockets/clients" who are part of that room will receive this message, and this "_socket" client will not receive this event

  _socketIoServer.emit('key-name', 'message value') // as we are using the io server and not the "_socket/client" object here to send the message so it is almost same as "_socket.emit("key-name", 'message value')", the only difference is that all clients who are connected to this server will receive this message, and as we are not defining a namespace so it will use the default "/" namespace, so all clients who are part-of/or connected to "/" namespace (or no namespace (which means default namespace "/")) will receive this message
  // "_socketIoServer.emit("key-name", 'message value')" this is equivalent to "_socketIoServer.of("/").emit("key-name", 'message value')"

  _socketIoServer.of('/admin').emit('key-name', 'message value') // here as we are defining the "/admin" namespace and server is sending the message so this message will get transmitted to all clients in all rooms in "/admin" namespace

  _socketIoServer
    .of('/admin')
    .to('/zaions')
    .emit('key-name', 'message value') // here as we are defining the "/admin" namespace and server is sending the message and we are also defining the "/zaions" room, so this message will get transmitted to all clients in "/zaions" room only in "/admin" namespace

  // finally, we can send a message to a specific "client/socket id" as well, that can be treated as private message between two users, or private message from server to a user, that will be like this
  console.log({ id: _socket.id })
  _socketIoServer
    .to(_socket.id)
    .emit(
      'message-on-client-private-id',
      'any message which we want to send to just this user'
    )

  _socket.on('newMessage_FromClient', message => {
    console.log({ newMessage_FromClient: message })
    _socketIoServer.emit('newMessage_FromServer', message.text)
  })
})
