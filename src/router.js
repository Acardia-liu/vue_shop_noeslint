import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
Vue.use(Router);

const router =new Router({
  routes: [
    /* 重定向：当路径是"/"时，自动重定向到"/login" */
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
});

//挂载路由导航守卫
router.beforeEach(((to, from, next) => {
  //to将要访问的路径
  //form代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next()放行
  // next('/login')强制跳转到登录界面
  if(to.path === '/login') return next();
  //先获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next()
}));
export default router
