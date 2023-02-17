const _ioMainNameSpace = io('http://localhost:5001') // this will connect to "/" namespace/endpoint
const _ioAdminNameSpace = io('http://localhost:5001/admin') // this will connect to "/admin" namespace/endpoint

_ioMainNameSpace.on('connect', event => {
  console.log({ message: 'connection made', id: _ioMainNameSpace.id })
})

_ioMainNameSpace.on('server-message', messageInfo => {
  console.log({
    message: 'a new message received from server',
    messageInfo
  })
})

_ioMainNameSpace.on('message-on-client-private-id', messageInfo => {
  console.log({
    message:
      'a new message received from server, on "message-on-client-private-id"',
    messageInfo
  })
})

_ioMainNameSpace.on('newMessage_FromServer', message => {
  console.log({ newMessage_FromServer: message })
  $('#messages').append(`<li>${message}</li>`)
})

$(document).ready(() => {
  $('#form').submit(e => {
    e.preventDefault()

    const value = $('input').val()

    _ioMainNameSpace.emit('newMessage_FromClient', {
      text: value
    })
  })
})
