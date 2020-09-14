<template>
  <div>
    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="1" :textsize="190" class="mb-3"/>

    <splitpanes class="default-theme" vertical style="height: 70vh" vertical>
      <pane class="p-2" min-size="20" max-size="80">
        <!-- -------------------------------------------- -->
        <!-- TABLE -->
        <!-- -------------------------------------------- -->
        <!-- table header -->
        <div class="group-header">
          <b-row>
            <b-col md="2" class="my-1">
            </b-col>
            <b-col md="10" class="my-1">
              <b-form-group  label-cols-lg="4" label-cols-md="3" label-cols-sm="6"  class="mb-0">
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

        <b-table
          sticky-header
          responsive
          show-empty
          stacked="md"
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

          <template slot="action" slot-scope="row">
            <button type="button" class="btn-sm btn-primary">Open
            </button>
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
        <div class="col p-0" style="height: 100%; width: 100%">
          <vue-leaflet-heatmap :markers="markers" :center="center"/>
        </div>
      </pane>
    </splitpanes>


    <view-bottom-wizard-button class="mt-2" index="1" :left_clicked="wizardButtonClicked('processwizard1')" :right_clicked="wizardButtonClicked('processwizard3')"/>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTabProcessIcon, createTabProcessText} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {createTableAreaListHeader} from "../../libs/libVars";
  import VueLeafletHeatmap from "../components/vue-leaflet-heatmap";

  export default {
    name: "ProcessWizardStep2",

    components: {
      VueLeafletHeatmap,
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
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
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},

        cur_tab: 0,
        center: L.latLng(-6.90389, 107.61861),
        markers: [
          [-0.718818, 117.44827, 1],
          [-0.728818, 117.45827, 0.75],
          [-0.738818, 117.46827, 1],
          [-0.748818, 117.47827, 1],
          [-0.758818, 117.48827, 1],
          [-0.768818, 117.49827, 0.5],
          [-0.778818, 117.49827, 1]
        ],
        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableAreaListHeader(),
        table_datas: [],

        event_http_list: {success: "successList", fail: "failList"},
        event_http: {success: "success", fail: "fail"},
      }
    },

    beforeMount: function ()
    {
      this.getListData();
    },

    methods: {
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
      //-----------------------------------------------------

      getTabIcon()
      {
        return (createTabProcessIcon())
      },
      getTabText()
      {
        return (createTabProcessText())
      },
      wizardButtonClicked(str_router)
      {
        return (this.varRouter.getRoute(str_router, 1))
      },

      getListData()
      {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedWell', {}); //set selected project
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_list]).then();
      },

      createDemoCss(cc)
      {
        return ('<span class="map-marker3" style="background-color:' + cc + '"/>');
      },
      createCustomMarkerPopup(item)
      {
        let sstr = 'Area : <b>' + item.area + '</b><br>';
        sstr = sstr + 'Lat : <b>' + item.lat + '</b><br>';
        sstr = sstr + 'Lon : <b>' + item.lon + '</b>';
        return (sstr);
      },
    },
    mounted()
    {
      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) =>
      {
        //create table header
        // let col_action = { label: "Action", key:"action", default: "", tdClass: 'align-middle'};
        // this.table_headers.push(col_action);
        this.table_datas = msg; //fill table contents
        this.center = L.latLng(msg[0].lat, msg[0].lon);

        // this.markers = [
        //   [-0.628818, 117.35827, 1],
        //   [-0.728818, 117.45827, 0.75],
        //   [-0.828818, 117.55827, 1],
        //   [-0.828818, 117.65827, 1],
        //   [-0.828818, 117.75827, 1],
        //   [-0.928818, 117.85827, 0.5],
        //   [-0.958818, 117.95827, 1]
        // ];
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

      });

      EventBus.$on(this.event_http.fail, (msg) =>
      {
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
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
