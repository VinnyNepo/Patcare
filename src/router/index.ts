import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home.vue'
import CrudPage from '@/pages/crud.vue'
import ConsultaPage from '@/pages/consulta.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomePage },
    { path: '/crud', name: 'crud', component: CrudPage },
    { path: '/consulta', name: 'consulta', component: ConsultaPage },
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
})

export default router
