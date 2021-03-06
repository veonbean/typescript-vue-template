import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/request'
import './plugins/element.ts'
import { AxiosInstance } from 'axios'

declare module 'vue/types/vue' {
  interface Vue {
    $request: AxiosInstance;
  }
}

Vue.config.productionTip = false
Vue.prototype.$request = request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
