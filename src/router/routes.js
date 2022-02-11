const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '/auth',
        component: () => import('pages/Auth.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/index',
        name: 'index',
        component: () => import('pages/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/cards',
        name: 'cards',
        component: () => import('pages/cards.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/dashboard.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/planejamento',
        name: 'planejamento',
        component: () => import('pages/planejamento.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/visita',
        name: 'visita',
        component: () => import('pages/visita.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/contatos',
        name: 'contatos',
        component: () => import('pages/contatos.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/acp',
        name: 'acp',
        component: () => import('pages/acp.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/scripts',
        name: 'scripts',
        component: () => import('pages/scripts.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/diversos',
        name: 'diversos',
        component: () => import('pages/diversos.vue'),
        meta: {
          auth: true
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
