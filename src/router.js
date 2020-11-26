import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')

//把Welcome作为Home的子路由规则
// import Welcome from "./components/Welcome";
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ "./components/Welcome")

// import Users from "./components/user/Users";
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ "./components/user/Users")
// import Rights from "./components/power/Rights";
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ "./components/power/Rights")
// import Roles from "./components/power/Roles";
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ "./components/power/Roles")


// import Cate from "./components/goods/Cate";
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ "./components/goods/Cate")
// import Params from "./components/goods/Params";
const Params = () => import(/* webpackChunkName: "Cate_Params" */ "./components/goods/Params")


// import GoodsList from "./components/goods/List"
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ "./components/goods/List")
// import Add from "./components/goods/Add";
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ "./components/goods/Add")


// import Order from "./components/order/Order";
const Order = () => import(/* webpackChunkName: "Order_Report" */ "./components/order/Order")
// import Report from "./components/report/Report";
const Report = () => import(/* webpackChunkName: "Order_Report" */ "./components/report/Report")


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
          { path: '/params',component: Params},
          { path: '/goods',component: GoodsList},
          { path: '/goods/add',component: Add},
          { path: '/orders',component: Order},
          { path: '/reports',component: Report}


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
