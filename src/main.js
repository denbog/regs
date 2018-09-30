import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vue-electron'

import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/api'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
