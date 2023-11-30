import { createRouter, createWebHistory } from "vue-router";
import {token} from "./auth";
import Test from "./components/Test.vue";

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
            path: '/test',
            component: Test,
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