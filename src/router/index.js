import { createRouter, createWebHistory } from 'vue-router';

// Layout
import MainLayout from '../layouts/MainLayout.vue';

// Pages
import Notes from '../views/notes/index.vue';
import NoteForm from '../views/notes/form.vue';

const routes = [
    { path: '/:pathMatch(.*)*', name: 'Not Found', component: () => import('../views/error/404/index.vue') },

    // Login
    { path: '/login', component: () => import('../views/auth/index.vue'), meta: { page: 'login' } },

    // Register
    {
        path: '/',
        component: MainLayout,
        children:
        [
            {
                path: 'register',
                component: () => import('../views/auth/register.vue'), meta: { page: 'register' },
            }
        ],
    },

    // Notes
    {
        path: '/',
        component: MainLayout,
        children:
        [
            {
                path: 'notes',
                component: Notes,
            },
            {
                path: 'note/create',
                component: NoteForm,
                meta:
                {
                    page: 'create',
                },
            },
            {
                path: 'note/:id/edit',
                component: NoteForm,
            }
        ],
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) =>
{
  const notAuthRequired = ['login', 'register'];

  const hasAccessToken = localStorage.getItem('token') !== null;

  const authRequired = !notAuthRequired.includes(to.meta.page);

  if (authRequired && !hasAccessToken)
  {
      return next('/login');
  }

  if (hasAccessToken && !authRequired)
  {
      return next('/notes');
  }

  if (to.path === '/') return next('/notes');

  return next();
});

export default router;
