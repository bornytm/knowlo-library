import Vue from 'vue'
import VueRouter from 'vue-router' 
import mainRoutes from './routes'
import testingRoutes from './testingRoutes'

Vue.use(VueRouter)

const routes = [... testingRoutes, ... mainRoutes]

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    // scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
