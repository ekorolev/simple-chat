<template>
  <div
    class="username-setting"
    @mouseenter="expand"
    @mouseleave="shrink"
  >
    <div class="icon" v-if="shrinked">
      👨🏻
    </div>
    <div class="input" v-if="!shrinked">
      <input type="text" @keypress.enter="$emit('newName', newName)" v-model="newName" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      shrinked: true,
      newName: ''
    }
  },
  created () {
    this.newName = this.name
  },
  watch: {
    name (newName) {
      this.newName = newName
    }
  },
  methods: {
    expand () {
      this.newName = this.name
      this.shrinked = false
    },
    shrink () {
      this.shrinked = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.username-setting
  margin-right 10px
  display inline-block
  position relative
  cursor pointer
  height 48px
  border-radius 24px
  background gray
  line-height 48px
  text-align center
  .icon
    width 48px
  .input
    width 260px
    height 48px
    input
      background transparent
      outline none
      border 0px
      color black
</style>
