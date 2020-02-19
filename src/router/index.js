import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Register from '@/components/login/register'
import Five from '@/components/five'
import Home from '@/components/home/home'
import Rloe from '@/components/role/role'
import User from '@/components/user/user'
import Menu from '@/components/menu/menu'
import Type from '@/components/type/type'
import Bill from '@/components/bill/bill'
import BillDetail from '@/components/bill/billDetail/billDetail'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [

    {
      path: '/',
      name: '首页',
      component: Home,
      children: [
        {
          path: "/role",
          name: "角色管理",
          component: Rloe,
        },
        {
          path: "/user",
          name: "用户管理",
          component: User,
        },
        {
          path: "/menu",
          name: "权限管理",
          component: Menu,
        },
        {
          path: "/type",
          name: "类别管理",
          component: Type
        },
        {
          path: "/bill",
          name: "账单管理",
          component: Bill
        },
        {
          path: "/billDetail",
          name: "账单详情",
          component: BillDetail
        }


      ]
    },
    {
      path: '/login',
      name: '登陆',
      component: Login
    },
    {
      path: '/register',
      name: '注册',
      component: Register
    },
    {
      path: '/five',
      name: '五子棋',
      component: Five
    },

  ]
})
