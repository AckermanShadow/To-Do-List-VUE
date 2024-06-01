import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        name: 'List Task',
        component: () =>
            import ('@/views/pages/ListTask.vue')
    }, ]
});

export default router;