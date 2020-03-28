import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import TextareaAutosize from 'vue-textarea-autosize'
import VueMoment from 'vue-moment'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_SOCKET_URL,
  vuex: {
    store,
    actionPrefix: 'socket_',
    mutationPrefix: 'socket_'
  }
}))
Vue.use(TextareaAutosize)
Vue.use(VueMoment)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
