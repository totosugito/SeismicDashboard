import Vue from 'vue'
import Router from 'vue-router'

import store from './_store';
import VarRouter from "./_var-routers";

const varRouter = new VarRouter();
Vue.use(Router);

//frontpage
const Page404 = () => import('MyLibVue/src/views/Page404');
const Page500 = () => import('MyLibVue/src/views/Page500');
const PageLogin = () => import('../views/frontpage/PageLogin');
const DefaultContainer = () => import('../views/containers/DefaultContainer');

export default new Router({

  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    // ---------------------------------------------------------------
    // TESTING PAGE
    // ---------------------------------------------------------------
    {
      path: varRouter.getRoute("start", 1),
      name: varRouter.getRoute("start", 2),
      component: () => import('../views/testing/SeismicView')
    },

    // ---------------------------------------------------------------
    // FRONT PAGE
    // ---------------------------------------------------------------
    {
      path: varRouter.getRoute("404", 1),
      name: varRouter.getRoute("404", 2),
      component: Page404
    },
    {
      path: varRouter.getRoute("500", 1),
      name: varRouter.getRoute("500", 2),
      component: Page500
    },
    {
      path: varRouter.getRoute("*", 0),
      component: Page404
    },
    {
      path: varRouter.getRoute("login", 1),
      name: varRouter.getRoute("login", 2),
      component: PageLogin
    },
    {
      path: varRouter.getRoute('forgot-password', 1),
      name: varRouter.getRoute('forgot-password', 2),
      component: () => import('../views/frontpage/PageForgotPassword') //PageForgotPassword
    },

    {
      path: '/',
      redirect: varRouter.getRoute("well", 1),
      name: varRouter.getRoute("well", 2),
      component: DefaultContainer,
      beforeEnter(to, from, next)
      {
        if (!store.getters.isAuthenticated)
        {
          next(varRouter.getRoute("login", 1))
        }
        else
        {
          next();
        }
      },

      children: [
        {
          path: '/',
          name: '',
          // component: () => import('../views/Dashboard') //Dashboard
          component: () => import('../views/pages/WellTable') //Dashboard
        },
        {
          path: '',
          meta: {label: ''},
          component: {
            render(c)
            {
              return c('router-view')
            }
          },
          children: [
            {
              path: varRouter.getRoute("well", 1),
              name: varRouter.getRoute("well", 2),
              component: () => import('../views/pages/WellTable')
            },
            {
              path: varRouter.getRoute("inline-crossline", 1),
              name: varRouter.getRoute("inline-crossline", 2),
              component: () => import('../views/pages/InlineTable'),
            },
            // {
            //   path: varRouter.getRoute("seismicviewer", 1),
            //   name: varRouter.getRoute("seismicviewer", 2),
            //   component: () => import('../views/pages/SeismicViewer')
            // },
            {
              path: varRouter.getRoute("home", 1),
              name: varRouter.getRoute("home", 2),
              component: () => import('../views/testing/SeismicView')
            },


            {
              path: varRouter.getRoute("inline-crossline", 1),
              meta: {label: varRouter.getRoute("inline-crossline", 2)},
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: varRouter.getRoute("seismicviewer", 1),
                  name: varRouter.getRoute("seismicviewer", 2),
                  component: () => import('../views/pages/SeismicViewer')
                },
              ]
            },
          ]
        },



        // {
        //   path: varRouter.getRoute("inline-crossline", 1),
        //   meta: {label: varRouter.getRoute("inline-crossline", 2)},
        //   component: {
        //     render(c) {
        //       return c('router-view')
        //     }
        //   },
        //   children: [
        //     {
        //       path: varRouter.getRoute("seismicviewer", 1),
        //       name: varRouter.getRoute("seismicviewer", 2),
        //       component: () => import('../views/pages/SeismicViewer')
        //     },
        //   ]
        // },
      ]
    },
  ]
})
