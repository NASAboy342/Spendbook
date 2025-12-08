// Vue Router configuration
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authService } from '@/services/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/TransactionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('@/views/AccountsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/topics',
    name: 'Topics',
    component: () => import('@/views/TopicsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'Login' })
  } else if (!requiresAuth && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // Redirect to dashboard if already authenticated
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
