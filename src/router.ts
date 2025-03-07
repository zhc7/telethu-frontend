import { createRouter, createWebHistory } from "vue-router";
import {token} from "./auth";
const Login = () => import('./components/Login.vue');
const Main = () => import ('./components/Main.vue')


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/chat',
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/:page',
            component: Main,
            props: true,
        }
    ]
})

router.beforeEach((to, _, next) => {
    if (to.path === '/login') {
        next();
    } else {
        if (token.value === "") {
            next('/login');
        } else {
            next();
        }
    }
})

export default router;