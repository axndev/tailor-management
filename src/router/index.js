import { createWebHistory, createRouter } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import CustomersView from '@/views/CustomersView.vue'
import SettingsView from '@/views/SettingsView.vue'
import CustomerForm from "@/views/CustomerForm.vue"


const routes = [
  { path: '/', component: DashboardView },
  { path: '/customers', component: CustomersView },
  { path: '/settings', component: SettingsView },
  {
    path: "/customer/create",
    name: "CustomerCreate",
    component: CustomerForm,
    props: { mode: "create" }
  },
  {
    path: "/customer/:id/edit",
    name: "CustomerEdit",
    component: CustomerForm,
    props: route => ({ mode: "edit", id: route.params.id })
  },
  {
    path: "/customer/:id/view",
    name: "CustomerView",
    component: CustomerForm,
    props: route => ({ mode: "view", id: route.params.id })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router;