<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import mutations from './store/mutations'

export default {
  created () {
    window.onfocus = () => {
      console.log('window focused')
      this.$store.commit(mutations.SET_WINDOW_FOCUSED, true)
    }

    window.onblur = () => {
      console.log('window blured')
      this.$store.commit(mutations.SET_WINDOW_FOCUSED, false)
    }
  }
}
</script>

<style lang="stylus">
html, body
  margin 0px
  padding 0px
  background #232931
  color #eeee
  height 100%
  overflow hidden
#app
  height 100%
  overflow hidden
</style>
