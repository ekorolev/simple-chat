<template>
  <div
    class="chat-message"
    :class="{
      right: message.username === 'You',
      system: message.type === 'system'
    }"
  >
    <div class="delimiter" v-if="message.type==='delimiter'">
      <span>{{ message.timestamp | moment('LL')}}</span>
    </div>
    <div class="not-delimiter" v-else>
      <span class="name" v-if="message.type==='public'">{{ message.username }}</span>
      <span class="text">{{ message.message }}</span>
      <span class="timestamp">{{ message.timestamp | moment('LT') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.chat-message
  width calc(100% - 20px)
  margin 5px
  &.right
    text-align right
  &.system
    border-radius 10px
    color silver
  .name
    padding 2px
    margin 3px
    border-radius 4px
    border-color transparent
    background #393e46
    color #4ecca3
    font-size 15px
  .text
    font-size 13px
  .timestamp
    font-size 10px
    color #fae7cb
    padding-left 5px

  .delimiter
    width 100%
    text-align center
    span
      background: #808080
      border-radius 8px
      padding 3px 8px
      margin 5px
</style>
