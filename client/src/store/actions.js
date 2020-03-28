import eventNames from '../../../eventNames'

export default {
  SOCKET_ERROR: `socket_${eventNames.server.error}`,
  SOCKET_MESSAGE: `socket_${eventNames.server.message}`,
  SOCKET_PRIVATE_MESSAGE: `socket_${eventNames.server.privateMessage}`,
  SOCKET_CLIENT_CONNECTED: `socket_${eventNames.server.clientConnected}`,
  SOCKET_CLIENT_DISCONNECTED: `socket_${eventNames.server.clientDisconnected}`,
  SOCKET_USERNAME_CHANGED: `socket_${eventNames.server.usernameChanged}`,
  SOCKET_OLD_MESSAGES: `socket_${eventNames.server.oldMessages}`,
  SOCKET_MEMBER_LIST: `socket_${eventNames.server.memberList}`,
  SOCKET_RECONNECT: 'socket_reconnect',
  SOCKET_CONNECT: 'socket_connect',

  POST_NEW_MESSAGE: 'postNewMessage',
  SET_USERNAME: 'setUsername'
}
