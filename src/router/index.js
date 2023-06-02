import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
/**
 * 无需权限的路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/dashboard'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/problem_set',
    component: Layout,
    redirect: '/problem_set/all',
    name: 'problem_set',
    meta: { title: '刷刷OJ', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/problem/problem-all'),
        meta: { title: '题库', icon: 'el-icon-s-grid' }
      },
      {
        path: 'problem',
        name: 'problem',
        component: () => import('@/views/problem/problem-detailed'),
        meta: { title: '题目', icon: 'el-icon-thumb' }
      }
    ]
  },

  {
    path: '/my_upload',
    component: Layout,
    // redirect: '/problem_set/',
    name: 'problem_set',
    meta: { title: '', icon: 'el-icon-upload2' },
    children: [
      {
        path: '',
        name: '',
        component: () => import('@/views/my_upload/my_upload'),
        meta: { title: '我的上传', icon: 'el-icon-upload2' }
      }
    ]
  },

  {
    path: '/statistic',
    component: Layout,
    // redirect: '/statistic',
    name: 'problem_set',
    meta: { title: '统计信息', icon: 'el-icon-s-data' },
    children: [
      {
        path: '',
        name: '',
        component: () => import('@/views/my_statistic/statistic'),
        meta: { title: '我的统计', icon: 'el-icon-close' }
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/my_statistic/history'),
        meta: { title: '历史记录', icon: 'el-icon-close' }
      }
    ]
  }

]

/**
 * 权限路由
 */
export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/dashboard',
    name: 'problem_set',
    meta: { roles: ['admin'], title: '管理员菜单', icon: 'el-icon-s-cooperation' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/dashboard'),
        meta: { title: '仪表盘', icon: 'dashboard' }
      },
      {
        path: 'judgement',
        name: 'judgement',
        component: () => import('@/views/admin/judgement'),
        meta: { title: '审批题目变更', icon: 'el-icon-s-check' }
      },
      {
        path: 'management/user',
        name: 'user_management',
        component: () => import('@/views/admin/user_management'),
        meta: { title: '人员管理', icon: 'el-icon-user' }
      },
      {
        path: 'management/problem',
        name: 'problem_management',
        component: () => import('@/views/admin/problem_management'),
        meta: { title: '题目管理', icon: 'el-icon-s-grid' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
