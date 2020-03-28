import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import eventNames from '../../../eventNames'
import { v4 } from 'uuid'

Vue.use(Vuex)
const notificationSound = new Audio('/notify.mp3')
notificationSound.volume = 0.3

export default new Vuex.Store({
  state: {
    username: null,
    messages: [],
    users: [],
    windowFocused: true,
    notificationsEnabled: localStorage.getItem('notifications') === 'true'
  },
  mutations: {
    [mutations.ADD_MESSAGE] (state, payload) {
      state.messages.push({
        id: v4(),
        ...payload,
        timestamp: payload.timestamp || Date.now()
      })
    },

    [mutations.ADD_USER] (state, payload) {
      state.users.push(payload)
    },

    [mutations.REMOVE_USER] (state, payload) {
      state.users = state.users.filter(u => u.socketId !== payload.socketId)
    },

    [mutations.CHANGE_USERNAME] (state, payload) {
      state.users = state.users.map(user => {
        if (user.socketId === payload.socketId) {
          return { ...user, username: payload.username }
        } else {
          return user
        }
      })
    },

    [mutations.SET_USERNAME] (state, payload) {
      state.username = payload
    },

    [mutations.SET_WINDOW_FOCUSED] (state, value) {
      state.windowFocused = !!value
    },

    [mutations.TOGGLE_NOTIFICATIONS] (state) {
      state.notificationsEnabled = !state.notificationsEnabled
    }
  },
  getters: {
    userBySocketId (state) {
      return socketId => state.users.find(u => u.socketId === socketId)
    }
  },
  actions: {
    // SOCKET ERROR
    [actions.SOCKET_ERROR] (state, error) {
      console.log(`Socket error: ${error}`)
      state.commit(mutations.ADD_MESSAGE, {
        type: 'system',
        message: error
      })
    },

    [actions.SOCKET_RECONNECT] (context) {
      // register username
      if (context.state.username) {
        context.dispatch(actions.SET_USERNAME, context.state.username)
      }
    },
    [actions.SOCKET_CONNECT] (context) {
      // register username
      if (context.state.username) {
        context.dispatch(actions.SET_USERNAME, context.state.username)
      }
    },

    // On new socket message
    [actions.SOCKET_MESSAGE] (context, data) {
      const user = context.getters.userBySocketId(data.socketId)
      if (!user) return
      if (context.state.notificationsEnabled && !context.state.windowFocused) {
        console.log('play sound')
        notificationSound.play()
      }
      context.commit(mutations.ADD_MESSAGE, {
        username: user.username,
        socketId: user.socketId,
        type: 'public',
        message: data.message,
        timestamp: data.timestamp
      })
    },

    [actions.SOCKET_PRIVATE_MESSAGE] (context, data) {
      const user = context.getters.userBySocketId(data.socketId)
      if (!user) return
      context.commit(mutations.ADD_MESSAGE, {
        username: user.username,
        socketId: user.socketId,
        type: 'private',
        message: data.message,
        timestamp: data.timestamp
      })
    },

    [actions.SOCKET_CLIENT_CONNECTED] (state, data) {
      state.commit(mutations.ADD_USER, {
        username: data.username,
        socketId: data.socketId
      })
      state.commit(mutations.ADD_MESSAGE, {
        type: 'system',
        message: `${data.username} joined the chat`
      })
    },

    [actions.SOCKET_CLIENT_DISCONNECTED] (state, socketId) {
      const user = state.getters.userBySocketId(socketId)
      if (!user) return
      state.commit(mutations.REMOVE_USER, { socketId })
      state.commit(mutations.ADD_MESSAGE, {
        type: 'system',
        message: `${user.username} left the chat`
      })
    },

    [actions.SOCKET_USERNAME_CHANGED] (state, data) {
      const user = state.getters.userBySocketId(data.socketId)
      if (!user) return
      state.commit(mutations.CHANGE_USERNAME, {
        socketId: data.socketId,
        username: data.username
      })
      state.commit(mutations.ADD_MESSAGE, {
        type: 'system',
        message: `User ${user.username} changed username to ${data.username}`
      })
    },

    [actions.SOCKET_OLD_MESSAGES] (state, data) {
      data.forEach(message => {
        state.commit(mutations.ADD_MESSAGE, { ...message, type: 'public' })
      })
    },

    [actions.SOCKET_MEMBER_LIST] (state, data) {
      data.forEach(user => {
        state.commit(mutations.ADD_USER, user)
      })
    },

    [actions.POST_NEW_MESSAGE] (state, message) {
      this._vm.$socket.emit(eventNames.client.message, message)
      state.commit(mutations.ADD_MESSAGE, {
        username: 'You',
        type: 'public',
        message
      })
    },

    [actions.SET_USERNAME] (state, username) {
      state.commit(mutations.SET_USERNAME, username)
      this._vm.$socket.emit(eventNames.client.username, username)
    }
  },
  modules: {
  }
})
