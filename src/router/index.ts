import { createRouter, createWebHistory } from 'vue-router'
import ACCESS_ENUM from '@/access/accessEnum'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue')
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: () => import('@/pages/WorkbenchPage.vue'),
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: '/admin/user',
      name: 'userManage',
      component: () => import('@/pages/admin/UserManagePage.vue'),
      meta: {
        access: ACCESS_ENUM.ADMIN
      }
    },
    {
      path: '/noAuth',
      name: 'noAuth',
      component: () => import('@/pages/error/NoAuthPage.vue')
    },
    {
      path: '/user/login',
      name: 'login',
      component: () => import('@/pages/user/UserLoginPage.vue')
    },
    {
      path: '/user/register',
      name: 'register',
      component: () => import('@/pages/user/UserRegisterPage.vue')
    }
  ]
})

export default router
