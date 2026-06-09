import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'
import { refreshAllPublicData } from '@/utils/refreshPublicData'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/pages/public/HomePage.vue') },
        { path: 'about', name: 'about', component: () => import('@/pages/public/AboutPage.vue') },
        { path: 'contributions', name: 'contributions', component: () => import('@/pages/public/ContributionsPage.vue') },
        { path: 'transparency', name: 'transparency', component: () => import('@/pages/public/TransparencyPage.vue') },
        { path: 'gallery', name: 'gallery', component: () => import('@/pages/public/GalleryPage.vue') },
        { path: 'contact', name: 'contact', component: () => import('@/pages/public/ContactPage.vue') },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/pages/admin/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/pages/admin/DashboardPage.vue') },
        { path: 'donations', name: 'admin-donations', component: () => import('@/pages/admin/DonationsPage.vue') },
        { path: 'contributions', name: 'admin-contributions', component: () => import('@/pages/admin/ContributionsPage.vue') },
        { path: 'expenses', name: 'admin-expenses', component: () => import('@/pages/admin/ExpensesPage.vue') },
        { path: 'gallery', name: 'admin-gallery', component: () => import('@/pages/admin/GalleryPage.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('@/pages/admin/SettingsPage.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && authService.isAuthenticated()) {
    return { name: 'admin-dashboard' }
  }
})

router.afterEach((to, from) => {
  const goingPublic = !to.path.startsWith('/admin')
  const fromAdmin = from.path.startsWith('/admin')
  if (goingPublic && fromAdmin) {
    refreshAllPublicData()
  }
})

export default router
