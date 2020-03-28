<template>
  <div class="chat-container">
    <chat-message v-for="message in messages" :key="message.id" :message="message" />
    <chat-input @enter="newMessage" ref="chatInput"/>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export default {
  name: 'ChatContainer',
  components: {
    ChatMessage,
    ChatInput
  },
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  methods: {
    newMessage (message) {
      this.$emit('newMessage', message)
    }
  },
  watch: {
    async messages () {
      await this.$nextTick().then()
      this.$el.scrollTop = this.$el.scrollHeight
    }
  },
  mounted () {
    this.$refs.chatInput.focus()
  }
}
</script>

<style lang="stylus" scoped>
.chat-container
  position relative
  height 100%
  max-height 100%
  overflow hidden scroll
</style>
