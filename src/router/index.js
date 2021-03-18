// 导入vue
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../views/Login'
import NotFound from '../views/NotFound'
import index from "../views/index"
// 使用
Vue.use(VueRouter)
// 导出
const router=new VueRouter({

  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    // 登录页
    {
      path: '/index',
      component: index

    },
    // 登录页
    {
      path: '/login',
      component: Login

    },
    {
      path: '*',
      component: NotFound
    }
  ]

})

export default router
