const testingRoutes = [
    {
        path: '/cross-section',
        component: () => import('components/cross-section.vue')
    },
    {
      path: '/graph',
      component: () => import('../testing/vis-graph-test.vue')
    },
    {
      path: '/t',
      component: () => import('../testing/vis-timeline.vue')
    },
    {
      path: '/test',
      component: () => import('../testing/vis-graph-test.vue')
    },
]

export default testingRoutes