<template>
  <div class="Login">
    <div class="text">Type your username and press enter...</div>
    <input type="text" v-model="username" @keypress.enter="setUsername" />
  </div>
</template>

<script>
import actions from '../store/actions'

export default {
  name: 'Login',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    setUsername () {
      if (this.username.length === 0) return
      this.$store.dispatch(actions.SET_USERNAME, this.username)
      localStorage.setItem('username', this.username)
      this.username = ''
      this.$router.push({ name: 'Chat' })
    }
  }
}
</script>

<style lang="stylus" scoped>
div.text
  color green
  margin 5px
</style>
