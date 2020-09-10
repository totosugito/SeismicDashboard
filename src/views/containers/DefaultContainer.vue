<template>
  <div class="app">
    <template v-if="item_menu.show_menu===false">
      <router-view></router-view>
    </template>
    <template v-else>
      <AppHeader fixed>
        <SidebarToggler class="d-lg-none" display="md" mobile/>
        <b-link class="navbar-brand" to=".">
          <img class="navbar-brand-full" src="img/brand/logo.png" width="30" height="30" alt="APP Logo">
          <span class="logo-taskbar">{{user.title}}</span>
          <!--<img class="navbar-brand-minimized" src="img/brand/logo.png" width="30" height="30" alt="CoreUI Logo">-->
        </b-link>
        <SidebarToggler class="d-md-down-none" display="lg"/>
        <b-navbar-nav class="d-md-down-none">
          <!--<b-nav-item class="px-3" to="/dashboard">Dashboard</b-nav-item>-->
          <!--<b-nav-item class="px-3" to="/users" exact>Users</b-nav-item>-->
          <!--<b-nav-item class="px-3">Settings</b-nav-item>-->
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <DefaultHeaderDropdownAccnt/>
        </b-navbar-nav>
      </AppHeader>
      <div class="app-body" >
        <AppSidebar fixed>
          <SidebarHeader/>
          <SidebarForm/>
          <SidebarNav :navItems="nav" :appSkin="appSkin"></SidebarNav>
          <SidebarFooter/>
          <SidebarMinimizer :appSkin="appSkin"/>
        </AppSidebar>
        <main class="main">
          <Breadcrumb :list="list"/>
          <div class="container-fluid">
            <router-view></router-view>
          </div>
        </main>
      </div>
      <TheFooter>
        <div>
<!--          <a href="http://waviv.com">Waviv</a>-->
          <span class="ml-1">&copy; 2020</span>
        </div>
        <div class="ml-auto">
<!--          <span class="mr-1">Powered by</span>-->
<!--          <a href="http://waviv.com">Waviv</a>-->
        </div>
      </TheFooter>
    </template>
  </div>
</template>

<script>
  import nav from '../../_constant/_nav'
  import {
    Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader,
    SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb
  } from 'MyLibVue/src/coreui'
  import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'
  import {mapState} from "vuex";
  import {HIDDEN_MENU} from "../../_constant/app_keys";

  export default {
    name: 'DefaultContainer',
    components: {
      AsideToggler,
      AppHeader,
      AppSidebar,
      AppAside,
      TheFooter,
      Breadcrumb,
      DefaultHeaderDropdownAccnt,
      SidebarForm,
      SidebarFooter,
      SidebarToggler,
      SidebarHeader,
      SidebarNav,
      SidebarMinimizer
    },
    data()
    {
      return {
        //nav: this.updateDrawerMenu(), //nav.items,
        item_menu: {}
      }
    },
    computed: mapState({
      user: state => state.user,
      appSkin: state => state.appSkin,
      name()
      {
        return this.$route.name
      },
      list()
      {
        return this.$route.matched.filter((route) => route.name || route.meta.label)
      },
    }),
    created()
    {
      this.updateDrawerMenu();
      this.isHideDrawer();
    },
    methods: {
      isHideDrawer()
      {
        //this.item_menu = checkUserStartPage(this.user.level);
      },
      updateDrawerMenu()
      {
        //update drawer menu
        this.nav = [];
        let tmp_menu = nav.items;
        let hui = this.user[HIDDEN_MENU()]; //get hidden menu
        let bget;

        if(hui==undefined)
        {
          this.nav = tmp_menu;
          return;
        }

        for(let i=0; i<tmp_menu.length; i++)
        {
          bget = false;

          let tmpname = tmp_menu[i].router;
          for(let j=0; j<hui.length; j++)
          {
            if(tmpname===hui[j]) //compare with hidden menu list
            {
              bget = true;
              break;
            }
          }
          if(bget===false) //create drawer menu
            this.nav.push(tmp_menu[i]);
        }
      }
    }
  }
</script>
<style scoped>
  .sidebar {
    background: #0d47a1;
  }
</style>
