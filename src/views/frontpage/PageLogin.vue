<template>
  <div class="app flex-row align-items-center">

    <div class="container h-100">
      <div class="d-flex justify-content-center h-100">
        <div class="user_card">
          <div class="d-flex justify-content-center">
            <div class="brand_logo_container">
              <img src="../../_assets/images/idea-icon.png" class="brand_logo" alt="Logo">
            </div>
          </div>
          <div class="d-flex justify-content-center form_container">
            <b-form>
              <h1 class="page-title mb-4">Login</h1>

              <b-input-group class="mb-3">
                <b-input-group-prepend><b-input-group-text><i class="fa fa-user"></i></b-input-group-text></b-input-group-prepend>
                <b-form-input type="text" class="form-control" placeholder="Login ID" autocomplete="username email" v-model="textUserName"/>
              </b-input-group>
              <b-input-group class="mb-4">
                <b-input-group-prepend><b-input-group-text><i class="fa fa-lock"></i></b-input-group-text></b-input-group-prepend>
                <b-form-input type="password" class="form-control" placeholder="Password" autocomplete="current-password" v-model="textPassword"/>
              </b-input-group>

              <div class="d-flex justify-content-center mt-3 login_container">
<!--                <button type="button" name="button" class="btn login_btn" @click="authenticate">Login</button>-->
                <button type="button" name="button" class="btn login_btn" @click="gotoDashboardPage()">Login</button>
              </div>
            </b-form>
          </div>

          <div class="mt-4">
            <div class="d-flex justify-content-center primary">
              <b-button router-link to="/forgot-password" variant="link" class="px-0">Forgot your password?</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from 'MyLibVue/src/libs/eventbus';
import {mapState} from "vuex";
import "../../_constant/_var-routers";
import {appDebugServer, checkUserStartPage} from "../../_constant/http_api";

export default {
  name: 'Login',

  computed: mapState({
    varRouter: state => state.varRouter,
    spinLoader: state => state.spinLoader,
  }),

  created() {
    this.$store.dispatch('createVarRouter').then(); //no selected project
    this.$store.dispatch('logout').then(); //no selected project
    if(appDebugServer()===true)
    {
      this.textUserName = "demo";
      this.textPassword = "demo";
    }
  },

  data () {
    return {
      showLoader : false,
      retStatus: {status: 0, title: "", message: "", data: []},
      textUserName: '',
      textPassword: '',
      event_http :{success:"success", fail:"fail"},
    }
  },

  methods: {
    gotoDashboardPage () {
      this.$router.push(this.varRouter.getRoute("home", 1))
    },
    authenticate () {
      this.showLoader = true;
      this.$store.dispatch('login', [{
        token: "",
        type: this.varRouter.getHttpType("user"),
        subtype: this.varRouter.getSchemaType("login", 0),
        param: [{
          loginID: this.textUserName, password: this.textPassword,
          username: this.textUserName}]
      }, this.event_http])
        .then()
    },
  },
  mounted () {
    EventBus.$on(this.event_http.success, (msg) => {
      this.showLoader = false;
      // let model = msg.data[0];
      //
      // let start_page = checkUserStartPage(model.level);
      // this.$router.push(this.varRouter.getRoute(start_page.router, 1));
    });
    EventBus.$on(this.event_http.fail, (msg) => {
      this.retStatus = msg;
      this.showLoader = false;
    });
  },
  beforeDestroy () {
    EventBus.$off(this.event_http.success);
    EventBus.$off(this.event_http.fail);
    this.showLoader = false;
  }
}
</script>

<style>
  .user_card {
    height: 400px;
    width: 350px;
    margin-top: auto;
    margin-bottom: auto;
    background: whitesmoke;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 5px;

  }
  .brand_logo_container {
    position: absolute;
    height: 120px;
    width: 120px;
    top: -60px;
    border-radius: 50%;
    background: #60a3bc;
    padding: 10px;
    text-align: center;
  }
  .brand_logo {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 2px solid white;
  }
  .form_container {
    margin-top: 40px;
  }
  .login_btn {
    width: 100%;
    background: #c0392b !important;
    color: white !important;
  }
  .login_btn:focus {
    box-shadow: none !important;
    outline: 0px !important;
  }
  .login_container {
    padding: 0 2rem;
  }
  .input-group-text {
    background: #c0392b !important;
    color: white !important;
    border: 0 !important;
    border-radius: 0.25rem 0 0 0.25rem !important;
  }
  .custom-checkbox .custom-control-input:checked~.custom-control-label::before {
    background-color: #c0392b !important;
  }
</style>
