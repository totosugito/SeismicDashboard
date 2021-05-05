<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="cur_tab" :textsize="190" class="mb-3"/>

<!--    <b-row  class="p-0 m-0">-->
<!--      <b-col md="12" class="p-0 m-0">-->
<!--        <b-card style="margin: 0px; padding: 0px">-->
<!--          <div slot="header">-->
<!--            <strong>Well List</strong>-->
<!--          </div>-->
    <splitpanes class="default-theme" vertical style="height: 74vh" vertical>
      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
        <!-- -------------------------------------------- -->
        <!-- TABLE -->
        <!-- -------------------------------------------- -->
        <!-- table header -->
        <div class="group-header">
          <b-row>
            <b-col md="2" class="my-1">
              <button type="button" class="btn-sm btn-secondary" @click=""
                      style="margin: 3px">Add Area
              </button>
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

          <template v-slot:cell(action)="row">
            <button type="button" class="btn-sm btn-primary" @click=""
                    style="margin: 3px">Edit
            </button>
            <button type="button" class="btn-sm btn-primary" @click=""
                    style="margin: 3px">Info
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
<!--          <vue-leaflet-map :markers="markers" :center="center"/>-->
          <template v-if="showLoader===false">
            <ApexChartLine :style="chartStyles" :chartOptions="lineChartOptions" :series="series"/>
          </template>
        </div>
      </pane>
    </splitpanes>

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
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTabProcessIcon, createTabProcessText} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {createTableAreaListHeader, createTableAreaListHeaderV0} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import ApexChartLine from "../components/ApexChartLine";
  import {apexChartSimpleProperties, createDefaultParam} from "../../libs/defApexChartLine";
  import {getBoundaryData} from "../../libs/simpleLib";
  import VueScreenSize from 'vue-screen-size';

  export default {
    name: "ProcessWizardStep1",

    mixins: [VueScreenSize.VueScreenSizeMixin],
    components: {
      ApexChartLine,
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueLeafletMap,
      VueSimpleDialog,
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,

      chartStyles() {
        return {
          width: `${this.chart_width}px`,
          height: `${this.chart_height}px`
        };
      }
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data()
    {
      return {
        showLoader : false,
        retStatus: {status: 0, title: "", message: "", data: []},

        cur_tab: 0,
        center: L.latLng(-6.90389, 107.61861),
        markers: [],

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,
        chart_width: 400,
        chart_height: 400,

        lineChartOptions: {},
        series: [],
        table_headers: createTableAreaListHeader(),
        table_datas: [],
        geobody_data: [],
        selected_data: {},

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list :{success:"successList", fail:"failList"},
        event_http_list_geo :{success:"successListGeo", fail:"failListGeo"},
        event_http :{success:"success", fail:"fail"},
      }
    },

    beforeMount: function () {
      this.getListArea();
    },

    methods: {
      //MESSAGE HTTP I/O
      dialogMessageBtn1Click() {
        if (this.retStatus.status === -1) { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        } else { //error token
          this.$refs.dialogMessage.hideModal();
        }
      },

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_datas.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_datas.length);
        } catch (e) {
          return (0);
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      //-----------------------------------------------------
      openGeobodyPage(item)
      {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2",
        });
      },
      openXYZPage(item)
      {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-1",
        });
      },

      getTabIcon()
      {
        return(createTabProcessIcon())
      },
      getTabText()
      {
        return(createTabProcessText())
      },
      wizardButtonClicked(str_router) {
        return(this.varRouter.getRoute(str_router, 1))
      },

      getListArea() {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedArea', {}); //set selected project
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_list]).then();
      },

      createDemoCss(cc)
      {
        return('<span class="map-marker3" style="background-color:' + cc +'"/>');
      },
      createCustomMarkerPopup(item)
      {
        let sstr = 'Area : <b>' + item.area + '</b><br>';
        sstr = sstr + 'Lat : <b>' + item.lat + '</b><br>';
        sstr = sstr + 'Lon : <b>' + item.lon + '</b>';
        return(sstr);
      },
    },
    mounted() {
      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        // console.log(JSON.stringify(msg))
        this.table_datas = msg.data; //fill table contents
        this.center = L.latLng(0, 0);

        this.series = [];
        this.markers = [];
        let all_x = [];
        let all_y = [];
        for (let i=0; i<this.table_datas.length; i++)
        {
          let item = this.table_datas[i];
          let mm = {
            id: i,
            area: item["name"],
            latlng: L.latLng(0, 0),
            popup : this.createCustomMarkerPopup(item),
            icon: new L.DivIcon({
              html: this.createDemoCss("#990000")
            })
          };
          this.markers.push(mm);

          let coordinate = item["coordinate"];
          let x1 = coordinate["p1"]["x"];
          if(x1===undefined)
            continue;

          all_x.push(coordinate["p1"]["x"]);
          all_x.push(coordinate["p2"]["x"]);
          all_x.push(coordinate["p3"]["x"]);
          all_x.push(coordinate["p4"]["x"]);
          all_y.push(coordinate["p1"]["y"]);
          all_y.push(coordinate["p2"]["y"]);
          all_y.push(coordinate["p3"]["y"]);
          all_y.push(coordinate["p4"]["y"]);

          let series_item = {
            name: item["name"],
            data: [
              [coordinate["p1"]["x"], coordinate["p1"]["y"]],
              [coordinate["p2"]["x"], coordinate["p2"]["y"]],
              [coordinate["p3"]["x"], coordinate["p3"]["y"]],
              [coordinate["p4"]["x"], coordinate["p4"]["y"]],
              [coordinate["p1"]["x"], coordinate["p1"]["y"]],
            ]
          };
          this.series.push(series_item);
        }
        let axis_bound = getBoundaryData(all_x, all_y,0.0);
        this.lineChartOptions = apexChartSimpleProperties();
        // this.lineChartOptions["xaxis"]["min"] = axis_bound[0];
        // this.lineChartOptions["xaxis"]["max"] = axis_bound[1];
        // this.lineChartOptions["yaxis"]["min"] = axis_bound[2];
        // this.lineChartOptions["yaxis"]["max"] = axis_bound[3];
        // let dx = axis_bound[1] - axis_bound[0];
        // let dy = axis_bound[3] - axis_bound[2];
        this.chart_height = this.$vssHeight/1.5;
        this.chart_width = this.chart_height;

        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_list_geo.success, (msg) => {
        this.geobody_data = [];
        this.showLoader = false;
      });

      EventBus.$on(this.event_http_list_geo.fail, (msg) => {
        this.showLoader = false;
        this.geobody_data = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http.success, (msg) => {

      });

      EventBus.$on(this.event_http.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      EventBus.$off(this.event_http_list_geo.success);
      EventBus.$off(this.event_http_list_geo.fail);
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

  .lc_seismic_chart {
    /*width: 400px;*/
    /*height: 400px;*/
  }
</style>
