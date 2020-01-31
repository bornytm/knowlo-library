
const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MyLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ]
  // },
    {
      path: '/vis-vuedrag',
      component: () => import('../testing/vis-vuedrag.vue')
    },
    {
      path: '/test',
      component: () => import('../testing/vis-timeline.vue')
    },
    {
      path: '/cross-section',
      component: () => import('components/cross-section.vue')
    },
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
      path: '/r/:uid',
      component: () => import('pages/resource.vue'),
      name: 'resource'
    },
    // { path: '/r/:uid', component: () => import('pages/resource.vue'), name: 'resource' }, // test - does it hit this first or load explore?
    {
        path: '/explore/:tagquery?',
        component: () => import('pages/explore.vue'),
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
