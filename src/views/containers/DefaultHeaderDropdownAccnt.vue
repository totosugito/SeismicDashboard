<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        :src="user.pasfoto"
        class="img-avatar"
        alt="avatar@mail.com" />
      <span class="text-avatar">Hi, {{user.loginID}}</span>
    </template>
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
      <b-dropdown-item><i class="fa fa-user" /> Profile</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-wrench" /> Settings</b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item @click="logout()"><i class="fa fa-lock"/> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from 'MyLibVue/src/coreui'
import {mapState} from "vuex";
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  computed: mapState({
    varRouter: state => state.varRouter,
    user: state => state.user
  }),
  created() {
    this.$store.dispatch('createVarRouter').then(); //no selected project
  },

  methods: {
    logout () {
      this.$store.dispatch('logout', {token: "", type : this.varRouter.getHttpType("user"), subtype: "logout", param: [this.user]})
        .then(() => this.$router.push(this.varRouter.getRoute("login", 1)))
    },
  },
}
</script>
