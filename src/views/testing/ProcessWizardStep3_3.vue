<template>
  <div>
    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="2" :textsize="190" class="mb-3"/>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <div><span class="mr-2" style="color: #0d47a1"><strong>Probability <i class="fa fa-hand-o-right"></i></strong>
            </span> Area : <strong>{{cur_area.area}}</strong>, Geobody : <strong>{{cur_area.geobody_name}} ({{cur_area.geobody_id}})</strong> , Class : {{cur_area.cls}}</div>
          </div>

          <splitpanes class="default-theme" vertical style="height: 60vh" vertical>
            <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
              <div>
                <!--            <b-row>-->
                <!--              <b-col md="5">-->
                <!--                <b-form-group label-cols="5" label-size="md" label="SEGY File">-->
                <!--                  <b-form-select v-model="cur_segy" :options="list_segy"></b-form-select>-->
                <!--                </b-form-group>-->
                <!--              </b-col>-->
                <!--            </b-row>-->
                <b-row>
                  <b-col md="5">
                    <b-form-group label-cols="5" label-size="md" label="Radius">
                      <b-form-input size="md" v-model="radius"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row class="text-right">
                  <b-col md="5">
                    <b-btn class="btn btn-md" variant="success" @click="getListSection()">Show Probability</b-btn>
                  </b-col>
                </b-row>
              </div>
              <!-- -------------------------------------------- -->
              <!-- TABLE -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="6" class="my-1">
                    <strong>Total : {{ndata}}</strong>
                  </b-col>
                  <b-col md="6" class="my-1">
                    <b-form-group label-cols-lg="4" label-cols-md="3" label-cols-sm="6" class="mb-0">
                      <b-input-group prepend="Filter : ">
                        <b-form-input v-model="filter" placeholder="Search"/>
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>

              <!-- table contents -->
              <b-table
                show-empty
                sticky-header="53vh"
                :small="true"
                :striped="true"
                :bordered="true"
                :outlined="true"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                @filtered="onFiltered"
                :fields="table_headers"
                :items="table_datas">

                <template v-slot:cell(cdp_x)="row">
                  {{row.item.cdp_x.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_y)="row">
                  {{row.item.cdp_y.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_z)="row">
                  {{row.item.cdp_z.toFixed(3)}}
                </template>
                <template v-slot:cell(prob)="row">
                  {{row.item.prob.toFixed(6)}}
                </template>

                <!-- action status -->
                <template v-slot:cell(action)="row">
                  <b-link :href="openDataUrl(row.item)" @click="openData(row.item)">Open</b-link>
                </template>
              </b-table>

              <!-- table footer -->
              <b-row>
                <b-col md="8" class="my-1">
                  <b-pagination :total-rows="computeTotalRow()" :per-page="perPage" v-model="currentPage" class="my-0"/>
                </b-col>
                <b-col md="4" class="my-1">
                  <b-input-group prepend="Per Page : ">
                    <b-form-select :options="pageOptions" v-model="perPageView" v-on:change="showPerPage"/>
                  </b-input-group>
                </b-col>
              </b-row>
            </pane>
            <pane class="pl-2 pt-2 pb-2 pr-0">
              <b-card no-body>
                <b-tabs card>
                  <b-tab title="Probability Map" active>
                    <template v-slot:title>
                      <i class="fa fa-image"/> Probability Map
                    </template>
                    <template v-if="proc_completed">
                      <expandable-image :close-on-background-click="true" :src="getUrlImage(0)" alt="Probability Map" style="width: 100%; height: 100%"/>
                    </template>
                  </b-tab>
                  <b-tab title="Probability Distribution">
                    <template v-slot:title>
                      <i class="fa fa-bar-chart"/> Probability Distribution
                    </template>
                    <template v-if="proc_completed">
                    <expandable-image :close-on-background-click="true" :src="getUrlImage(1)" alt="Probability Distribution"/>
                    </template>
                  </b-tab>
                  <b-tab title="Cumulative Distribution">
                    <template v-slot:title>
                      <i class="fa fa-line-chart"/> Cumulative Distribution
                    </template>
                    <template v-if="proc_completed">
                    <expandable-image :close-on-background-click="true" :src="getUrlImage(2)" alt="Cumulative Distribution"/>
                    </template>
                  </b-tab>
                </b-tabs>
              </b-card>
            </pane>
          </splitpanes>
        </b-card>
      </b-col>
    </b-row>
    <view-bottom-wizard-button class="mt-0" index="2" :left_clicked="wizardButtonClicked('processwizard2')"
                               :right_clicked="wizardButtonClicked('processwizard4')"/>

    <!-- show error dialog -->
    <vue-simple-dialog
      ref="dialogMessage"
      type="danger"
      :header="retStatus.title" body="Body"
      btn1_text="Tutup"
      btn1_style="success"
      @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.message}}</h5>
              </span>
    </vue-simple-dialog>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {getData} from "../../libs/data";
  import LChartSeismic from "../components/LChartSeismic";
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {
    createTableProbabilityHeader,
  } from "../../libs/libVars";
  import {createTabProcessIcon, createTabProcessText} from "../../libs/libSeismicUi";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import ExpandableImage from "../components/ExpandableImage";

  export default {
    name: "ProcessWizardStep3_3",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      LChartSeismic,
      VueSimpleDialog,
      Splitpanes, Pane,
      ExpandableImage
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data()
    {
      return {
        proc_completed: false,
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        perPageView: 15,
        perPage: 15,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,
        ndata: 0,

        table_headers: createTableProbabilityHeader(),
        table_datas: [],
        radius: 25,
        cur_segy: {},
        list_segy: [],
        cur_area: {},
        chart_image: ["https://picsum.photos/1024/400/?image=41", "https://picsum.photos/1024/400/?image=41", "https://picsum.photos/1024/400/?image=41"],

        event_http_list: {success: "successList", fail: "failList"},
        event_http: {success: "success", fail: "fail"},
      }
    },

    beforeMount: function ()
    {
      this.getListSegy();
    },

    methods: {
      getUrlImage(imode)
      {
        // return("http://117.54.250.85:9000/220538_cumulative-distribution.png");
        let server_url = 'http://117.54.250.85:9000/';
        if(imode===0)
          return(server_url + this.cur_area["geobody_id"] + "_cumulative-distribution.png");
        else if(imode===1)
          return(server_url + this.cur_area["geobody_id"] + "_gas-probability-map.png");
        else
          return(server_url + this.cur_area["geobody_id"] + "_probability-score-distribution.png");
      },
      //MESSAGE HTTP I/O
      dialogMessageBtn1Click()
      {
        if (this.retStatus.status === -1)
        { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        }
        else
        { //error token
          this.$refs.dialogMessage.hideModal();
        }
      },
      openData(item)
      {
        // this.$router.push({
        //   path: "process-wizard3",
        //   query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"]}
        // });
      },
      openDataUrl(item)
      {
        return ("");
        // return("#/process-wizard3?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },

      getListSegy()
      {
        this.cur_area = this.$store.getters.readSelectedArea;
        this.cur_area["geobody_file_id"] = this.$route.query.geobody_file_id;
        this.cur_area["geobody_id"] = this.$route.query.geobody_id;
        this.cur_area["cls"] = this.$route.query.cls;
        // this.showLoader = true;
        // this.$store.dispatch('http_get', ["/api/segy/file-list", {}, this.event_http]).then();
      },
      getListSection()
      {
        this.proc_completed = false;
        this.showLoader = true;
        let param = {
          geobody_file_id: this.cur_area["geobody_file_id"],
          geobody_id: this.cur_area["geobody_id"],
          segy_file_id: this.cur_segy,
          radius: this.radius
        };
        // param = {
        //   "geobody_file_id": "5f70dacf6180bd82dd6637a3",
        //   "geobody_id": "220538",
        //   "radius": 25
        // };
        this.$store.dispatch('http_post', ["/api/geobody/calc-prob", param, this.event_http_list]).then();
      },

      getTabIcon()
      {
        return (createTabProcessIcon())
      },
      getTabText()
      {
        let tab_text = createTabProcessText();
        tab_text[2] = "Probability List";
        return (tab_text)
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page)
      {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_datas.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow()
      {
        try
        {
          return (this.table_datas.length);
        }
        catch (e)
        {
          return (0);
        }
      },
      onFiltered(filteredItems)
      {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },

      onValidated(isValid, errors)
      {
        this.bvalidate = isValid;
      },

      wizardButtonClicked(str_router)
      {
        return (this.varRouter.getRoute(str_router, 1))
      }
    },
    mounted()
    {
      //-------------- LIST Well -------------------
      EventBus.$on(this.event_http_list.success, (msg) =>
      {
        // console.log(JSON.stringify(msg))
        //fill table contents
        this.table_datas = msg;
        this.ndata = this.table_datas.length;
        this.proc_completed = true;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) =>
      {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http.success, (msg) =>
      {
        this.list_segy = [];
        for (let i = 0; i < msg.length; i++)
          this.list_segy.push({
            value: msg[i]["_id"]["$oid"],
            text: msg[i]["file_name"]
          });
        this.showLoader = false;
      });

      EventBus.$on(this.event_http.fail, (msg) =>
      {
        this.list_segy = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy()
    {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .style_chart_proc {
    height: 65vh;
  }
</style>
