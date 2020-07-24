import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '医技预约', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/category',
    alwaysShow: true, // will always show the root menu
    name: 'contentMgr',
    hidden: true,
    children: [
      {
        path: 'createArticle',
        component: () => import('@/views/content/createArticle'),
        meta: { title: '添加消息' },
        name: 'createArticle',
        hidden: true
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export let asyncRoutes = []
export function resetRouter() {
  const newRouter = createRouter()
  asyncRoutes = []
  router.matcher = newRouter.matcher // reset router
}

export default router
