
const mainRoutes = [
    {
      path: '/status',
      component: () => import('pages/status.vue')
    },
    {
      path: '/about',
      component: () => import('pages/landing.vue')
    },
    {
      path: '/getInvolved',
      component: () => import('pages/getInvolved.vue')
    },
    {
      path: '/legal',
      component: () => import('pages/legal.vue')
    },
    {
      path: '/settings',
      component: () => import('pages/settings.vue')
    },
    {
      path: '/r/:uid', // heloooooooo
      component: () => import('pages/resource.vue'),
      name: 'resource'
    },
    // {
    //   path: '/explore/:tagquery?',
    //   component: () => import('pages/explore.vue'),
    // },
    // {
    //   path: '/',
    //   component: () => import('pages/explore.vue')
    // },
    {
        path: '/:tagquery?',
        component: () => import('pages/explore.vue'),
        name: 'explore',
        children: [
          { path: 'r/:uid', component: () => import('pages/resource.vue'), name: 'resourceSub' },
          { path: '/t/:name/:uid?', component: () => import('pages/tag.vue'), name: 'tag' },
        ]
      }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  mainRoutes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default mainRoutes
