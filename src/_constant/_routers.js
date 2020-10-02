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
    {
      path: "/multiview",
      name: "multiview",
      component: () => import('../views/testing/MultiSeismicViewer')
    },
    {
      path: "/test1",
      name: "test1",
      component: () => import('../views/testing/testHeatMap')
    },
    {
      path: "/test2",
      name: "test2",
      component: () => import('../views/testing/testHeatMapMesh')
    },
    {
      path: "/test3",
      name: "test3",
      component: () => import('../views/testing/test3dScatter')
    },
    {
      path: "/3dview",
      name: "3dview",
      component: () => import('../views/testing/Test3DScatterView')
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
      redirect: varRouter.getRoute("dashboard", 1),
      name: varRouter.getRoute("dashboard", 2),
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
              path: varRouter.getRoute("segy-list", 1),
              name: varRouter.getRoute("segy-list", 2),
              component: () => import('../views/pages/SegyTable')
            },
            {
              path: varRouter.getRoute("home", 1),
              name: varRouter.getRoute("home", 2),
              component: () => import('../views/testing/SeismicView')
            },
            {
              path: varRouter.getRoute("processwizard1", 1),
              name: varRouter.getRoute("processwizard1", 2),
              component: () => import('../views/testing/ProcessWizardStep1')
            },
            {
              path: varRouter.getRoute("processwizard2", 1),
              name: varRouter.getRoute("processwizard2", 2),
              component: () => import('../views/testing/ProcessWizardStep2')
            },
            {
              path: varRouter.getRoute("processwizard3", 1),
              name: varRouter.getRoute("processwizard3", 2),
              component: () => import('../views/testing/ProcessWizardStep3')
            },
            {
              path: varRouter.getRoute("processwizard4", 1),
              name: varRouter.getRoute("processwizard4", 2),
              component: () => import('../views/testing/ProcessWizardStep4')
            },
            {
              path: varRouter.getRoute("processwizard5", 1),
              name: varRouter.getRoute("processwizard5", 2),
              component: () => import('../views/testing/ProcessWizardStep5')
            },
            {
              path: varRouter.getRoute("processwizard6", 1),
              name: varRouter.getRoute("processwizard6", 2),
              component: () => import('../views/testing/ProcessWizardStep6')
            },

            // ---------------------------------------------------
            // ---------------------- geobody -----------------------
            // ---------------------------------------------------
            {
              path: varRouter.getRoute("geobody", 1),
              name: varRouter.getRoute("geobody", 2),
              component: () => import('../views/pages/GeobodyTable')
            },
            {
              path: varRouter.getRoute("geobody", 1),
              meta: {label: varRouter.getRoute("geobody", 2)},
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: varRouter.getRoute("geobody-info", 1),
                  name: varRouter.getRoute("geobody-info", 2),
                  component: () => import('../views/pages/GeobodyTableContents')
                },
              ]
            },

            // ---------------------------------------------------
            // ---------------------- WELL -----------------------
            // ---------------------------------------------------
            {
              path: varRouter.getRoute("well", 1),
              name: varRouter.getRoute("well", 2),
              component: () => import('../views/pages/WellTable')
            },
            {
              path: varRouter.getRoute("well", 1),
              meta: {label: varRouter.getRoute("well", 2)},
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: varRouter.getRoute("inline-crossline", 1),
                  name: varRouter.getRoute("inline-crossline", 2),
                  component: () => import('../views/pages/InlineTable')
                },
              ]
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
