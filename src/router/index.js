import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/AppDashboard.vue';
import Login from '../views/AppLogin.vue';
import Register from '../views/AppRegister.vue';

const routes = [
  { path: '/', redirect: '/login' }, // 默认跳转到登录页面
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // 需要登录才能访问
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token'); // 从 localStorage 获取 token
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login'); // 如果未登录，跳转到登录页面
  } else {
    next(); // 否则继续导航
  }
});

export default router;