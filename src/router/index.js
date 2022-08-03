import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/new',
      name: 'new-page',
      component: require('@/components/New').default
    },
    {
      path: '/statistics',
      name: 'statistics-page',
      component: require('@/components/Statistics').default
    },
    {
      path: '/export',
      name: 'export-page',
      component: require('@/components/Export').default
    },
    {
      path: '/certificate',
      name: 'certificate-page',
      component: require('@/components/Certificate').default
    },
    {
      path: '/loading',
      name: 'loading-page',
      component: require('@/components/Loading').default
    },
    {
      path: '/',
      name: 'member-page',
      component: require('@/components/Member').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
