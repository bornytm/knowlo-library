
const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MyLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ]
  // },
    {
      path: '/status',
      component: () => import('pages/status.vue')
    },
    {
      path: '/about',
      component: () => import('pages/landing.vue')
    },
    {
      path: '/principals',
      component: () => import('pages/principals.vue')
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
        path: '/:tagquery?',
        component: () => import('pages/explore-simple.vue'),
        name: 'explore',
        children: [
          { path: '/m/:uid', component: () => import('pages/member.vue'), name: 'member' },
          { path: '/r/:uid', component: () => import('pages/resource.vue'), name: 'resource' },
          { path: '/t/:name/:uid?', component: () => import('pages/tag.vue'), name: 'tag' },
          { path: '/addResource', component: () => import('components/addResource.vue'), name: 'addResource' }
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
