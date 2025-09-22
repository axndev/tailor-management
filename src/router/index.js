import { createWebHistory, createRouter } from 'vue-router';
import { auth } from '@/firebase'; // Make sure you have exported auth from firebase.js

import DashboardView from '@/views/DashboardView.vue';
import CustomersView from '@/views/CustomersView.vue';
import SettingsView from '@/views/SettingsView.vue';
import CustomerForm from "@/views/CustomerForm.vue";
import LoginView from "@/views/LoginView.vue";
import TrashView from '../views/TrashView.vue';
import ProfileView from '../views/ProfileView.vue';
import ThemeView from '../views/ThemeView.vue';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/customers', component: CustomersView, meta: { requiresAuth: true } },
  { path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
  { path: '/trash', component: TrashView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/theme', component: ThemeView, meta: { requiresAuth: true } },
  
  {
    path: "/customer/create",
    name: "CustomerCreate",
    component: CustomerForm,
    props: { mode: "create" },
    meta: { requiresAuth: true }
  },
  {
    path: "/customer/:id/edit",
    name: "CustomerEdit",
    component: CustomerForm,
    props: route => ({ mode: "edit", id: route.params.id }),
    meta: { requiresAuth: true }
  },
  {
    path: "/customer/:id/view",
    name: "CustomerView",
    component: CustomerForm,
    props: route => ({ mode: "view", id: route.params.id }),
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Navigation Guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')); // check local storage

  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else if (to.path === '/login' && user) {
    next('/');
  } else {
    next();
  }
});


export default router;
