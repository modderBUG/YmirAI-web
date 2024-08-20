import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue'; // 假设这是你的主页
import Register from '../views/Register.vue'; // 你的注册页面组件
import VoiceClone from '../views/VoiceClone.vue'; // 你的注册页面组件
import Login from '../views/login.vue'; // 你的注册页面组件

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
	  {
	        path: '',
	        redirect: '/home'
	      },
    {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
	{
	  path: '/login',
	  name: 'login',
	  component: Login
	},
    {
      path: '/voiceclone',
      name: 'VoiceClone',
      component: VoiceClone
    }
  ]
});
