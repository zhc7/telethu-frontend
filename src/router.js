import { createRouter, createWebHistory } from "vue-router";

const Login = () => import('./views/Login.vue');
const MessageFlow = () => import('./components/MessageFlow.vue');
const TestComponent = () => import('./components/Test.vue');
const ChatPage = () => import ('./components/Main.vue')


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/chat/:room_id',
            component: MessageFlow,
            props: true,
        },
        {
            path: '/test',
            component: TestComponent,
        },
        {
            path: '/layout',
            component: ChatPage,
        }
    ]
})

export default router;