<template>
  <textarea-autosize
    ref="textarea"
    type="text"
    v-model="value"
    @keypress.enter.native="done"
    placeholder="Type text here..."
    />
</template>

<script>
export default {
  name: 'Input',
  data () { return { value: '' } },
  methods: {
    done ($evt) {
      if (this.value.length === 0) return
      this.$emit('enter', this.value)
      this.value = ''
      $evt.preventDefault()
    },
    focus () {
      this.$refs.textarea.$el.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
textarea
  width calc(100% - 20px)
  border 0px
  padding 2px
  margin 2px
  background transparent
  outline 0px
  color #eeeeee
</style>
