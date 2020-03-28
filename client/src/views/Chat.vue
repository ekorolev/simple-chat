<template>
  <div class="home">
    <chat-container
      :messages="delimitMessages"
      @newMessage="postNewMessage"
    />
    <div class="control-panel">
      <username-setting
        :name="username"
        @newName="changeName"
      />
      <toggle-notifications
        :enabled="notificationsEnabled"
        @click="toggleNotifications"
      />
    </div>
  </div>
</template>

<script>
import actions from '../store/actions'
import mutations from '../store/mutations'
import ChatContainer from '../components/ChatContainer'
import ToggleNotifications from '../components/ToggleNotifications'
import UsernameSetting from '../components/UsernameSetting'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    ChatContainer,
    ToggleNotifications,
    UsernameSetting
  },
  data () {
    return {
      newMessage: ''
    }
  },
  computed: {
    ...mapState([
      'messages',
      'username',
      'notificationsEnabled'
    ]),
    delimitMessages () {
      const result = []
      let currentDay = null
      for (let i = 0; i < this.messages.length; i++) {
        if (currentDay !== new Date(this.messages[i].timestamp).getDate()) {
          currentDay = new Date(this.messages[i].timestamp).getDate()
          result.push({
            type: 'delimiter',
            timestamp: this.messages[i].timestamp
          })
        }
        result.push(this.messages[i])
      }
      console.log(result)
      return result
    }
  },
  methods: {
    postNewMessage (message) {
      if (!this.username) {
        if (message.toLowerCase() === 'you') {
          return this.$store.commit(mutations.ADD_MESSAGE, {
            type: 'system',
            message: 'The nickname "You" is not allowed',
            timestamp: Date.now()
          })
        }
        localStorage.setItem('username', message)
        this.$store.dispatch(actions.SET_USERNAME, message)
      } else {
        this.$store.dispatch(actions.POST_NEW_MESSAGE, message)
      }
    },
    toggleNotifications () {
      localStorage.setItem('notifications', !this.notificationsEnabled)
      this.$store.commit(mutations.TOGGLE_NOTIFICATIONS)
    },
    changeName (name) {
      localStorage.setItem('username', name)
      this.$store.dispatch(actions.SET_USERNAME, name)
    }
  },
  created () {
    const username = localStorage.getItem('username')
    if (!username) {
      this.$store.commit(mutations.ADD_MESSAGE, {
        type: 'system',
        message: 'Type your nickname in the area below and press "enter"...',
        timestamp: Date.now()
      })
    } else {
      this.$store.dispatch(actions.SET_USERNAME, username)
    }
  }
}
</script>

<style lang="stylus" scoped>
.home
  position relative
  height 100%
  max-height 100%
  .control-panel
    position absolute
    right 10px
    top 10px
</style>
