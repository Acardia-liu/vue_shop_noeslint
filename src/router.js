import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
//把Welcome作为Home的子路由规则
import Welcome from "./components/Welcome";
import Users from "./components/User/Users";
import Rights from "./components/power/Rights";
import Roles from "./components/power/Roles";
import Cate from "./components/goods/Cate";
import Params from "./components/goods/Params";
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
      component: Home,
      redirect: '/welcome',
      /*配置子路由规则*/
      children: [
          { path: '/welcome',component: Welcome},
          { path: '/users',component: Users},
          { path: '/rights',component: Rights},
          { path: '/roles',component: Roles},
          { path: '/categories',component: Cate},
          { path: '/params',component: Params}
      ]
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
