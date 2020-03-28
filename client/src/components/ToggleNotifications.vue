<template>
  <div class="toggle-button" @click="$emit('click')">
    🔔
    <div class="cross" v-if="!enabled">\</div>
  </div>
</template>

<script>
export default {
  name: 'ToggleNotifications',
  props: {
    enabled: Boolean
  }
}
</script>

<style lang="stylus" scoped>
.toggle-button
  display inline-block
  position relative
  cursor pointer
  width 48px
  height 48px
  border-radius 24px
  background gray
  line-height 48px
  text-align center
  &:hover
    opacity 0.8
  .cross
    position absolute
    top 0px
    left 16px
    font-size 40px
    font-weight bold
    color black

</style>
