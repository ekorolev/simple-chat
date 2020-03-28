const io = require('socket.io')()
const eventNames = require('./eventNames')
const redisClient = require('redis').createClient()
const { promisify } = require('util')
const lpushAsync = promisify(redisClient.lpush).bind(redisClient)
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient)
const ltrimAsync = promisify(redisClient.ltrim).bind(redisClient)
io.attach(8070)

io.on('connect', socket => {
  console.log(`Socket ${socket.id} connected`)

  // when user tries to post new message
  socket.on(eventNames.client.message, async message => {
    // send error if user name was not set
    if (!socket.username) {
      return socket.emit(eventNames.server.error, 'Set your username first!');
    }

    console.log(`Post message: ${message}`)

    const record = {
      username: socket.username,
      socketId: socket.id,
      message,
      timestamp: Date.now()
    }

    // broadcast all users expect this one the message
    socket.broadcast.emit(eventNames.server.message, record)

    // save message to the redis
    await lpushAsync('chat-history', JSON.stringify(record))
    await ltrimAsync('chat-history', 0, 999)
  })

  // when user tries to post new private message
  socket.on(eventNames.client.privateMessage, ({ message, socketId }) => {
    // send error if user name was not set
    if (!socket.username) {
      return socket.emit(eventNames.server.error, 'Set your username first!');
    }
    
    console.log(`Private message to ${socketId}: ${message}`)
    
    // take the receiver's socket and send message to it
    const receiver = io.clients().connected[socketId]
    if (receiver) {
      receiver.emit(eventNames.server.privateMessage, {
        username: socket.username,
        socketId: socket.id,
        message,
        timestamp: Date.now()
      })
    } else {

      // end error if receiver isn't existed
      socket.emit(eventNames.server.error, 'This client is disconnected');
    }
  })

  // when user tries to change username
  socket.on(eventNames.client.username, async username => {
    if (socket.username === username) return

    // if the socket set username for the first time, notify all users about new user
    // send message history to the client
    if (!socket.username) {
      if (username.toLowerCase() === 'you') {
        return socket.emit(eventNames.server.error, 'The nickname "You" is not allowed')
      }

      socket.broadcast.emit(eventNames.server.clientConnected, {
        socketId: socket.id,
        username
      })
      socket.username = username

      // send user old messages
      let messages = await lrangeAsync('chat-history', 0, 999)
      if (messages.length > 0) {
        socket.emit(eventNames.server.oldMessages, messages.map(message => JSON.parse(message)).reverse())
      }

      // send user member list
      const users = Object.values(io.clients().connected).map(s => ({
        socketId: s.id,
        username: s.username
      }))
      socket.emit(eventNames.server.memberList, users)
    } else {
      // just change username
      socket.broadcast.emit(eventNames.server.usernameChanged, {
        socketId: socket.id,
        username
      })
      socket.username = username
    }
  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)

    if (socket.username) {
      io.emit(eventNames.server.clientDisconnected, socket.id)
    }
  })
})
