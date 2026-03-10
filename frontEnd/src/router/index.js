import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import SoiFormView from '@/views/SoiFormView.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'Home', component: HomeView },
            { path: 'soi', name: 'SoiForm', component: SoiFormView }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
