<template>
  <div class="app">
    <template v-if="item_menu.show_menu===false">
      <router-view></router-view>
    </template>
    <template v-else>
      <AppHeader fixed>
        <SidebarToggler class="d-lg-none" display="md" mobile/>
        <b-link class="navbar-brand" to=".">
<!--          <img class="navbar-brand-full" src="img/brand/logo.png" width="30" height="30" alt="APP Logo">-->
          <div><span style="padding-left: 5px; font-style: normal; font-size: 120%">PHM</span><span style="font-size: 60%"> - Machine Learning</span></div>
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
<!--        <AppSidebar fixed>-->
<!--          <SidebarHeader/>-->
<!--          <SidebarForm/>-->
<!--          <template v-if="user.loginID==='admin'">-->
<!--            <SidebarNav :navItems="nav_admin" :appSkin="appSkin"></SidebarNav>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <SidebarNav :navItems="nav" :appSkin="appSkin"></SidebarNav>-->
<!--          </template>-->
<!--          <SidebarFooter/>-->
<!--          <SidebarMinimizer :appSkin="appSkin"/>-->
<!--        </AppSidebar>-->
        <main class="main">
<!--          <Breadcrumb :list="list"/>-->
<!--          <div class="container-fluid">-->
            <router-view></router-view>
<!--          </div>-->
        </main>
      </div>
      <TheFooter>
        <div>
<!--          <a href="http://waviv.com">Waviv</a>-->
          <img :src="getImageUrl('company/skk-migas-50px.png')" style="height:40px" class="mr-4"/>
          <img :src="getImageUrl('company/pertamina-hulu-mahakam-50px.png')" style="height:35px"/>
<!--          <span class="ml-1">&copy; 2020</span>-->
        </div>
        <div class="ml-auto">
<!--          <span class="mr-1">Powered by</span>-->
          <img :src="getImageUrl('company/halliburton-50px.png')" style="height:10px"/>
<!--          <a href="http://waviv.com">Waviv</a>-->
        </div>
      </TheFooter>
    </template>
  </div>
</template>

<script>
  import nav from '../../_constant/_nav'
  import nav_admin from '../../_constant/_nav_admin'
  import {
    Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader,
    SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb
  } from 'MyLibVue/src/coreui'
  import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'
  import {mapState} from "vuex";
  import {HIDDEN_MENU} from "../../_constant/app_keys";
  import {getAssetServer} from "../../_constant/http_api";

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
        nav: [],
        nav_admin : [],
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
      getImageUrl(sstr)
      {
        return(getAssetServer() + sstr);
      },
      isHideDrawer()
      {
        //this.item_menu = checkUserStartPage(this.user.level);
      },
      updateDrawerMenu()
      {
        //update drawer menu
        this.nav = nav.items;
        this.nav_admin = nav_admin.items;
      }
    }
  }
</script>
<style scoped>
</style>
