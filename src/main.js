import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'
import axiosInstance from './js/request.js';
import VueClipBoard from 'vue-clipboard2'

import router from './router';

Vue.use(VueClipBoard)
//use：将第三方模块 注入到Vue实例对象中的方法
Vue.use(VueAxios, axiosInstance)


Vue.config.productionTip = false

new Vue({
	router,
  render: h => h(App)
}).$mount('#app')
