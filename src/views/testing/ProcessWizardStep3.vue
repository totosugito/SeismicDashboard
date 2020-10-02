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
          <strong>Well List</strong>
        </div>

        <!-- -------------------------------------------- -->
        <!-- TABLE -->
        <!-- -------------------------------------------- -->
        <!-- table header -->
        <div class="group-header">
          <b-row>
            <b-col md="6" class="my-1">
              <!--                <button type="button" class="btn btn-success" @click="newData()"><i class="fa fa-plus"></i>&nbsp; Tambah Lokasi</button>-->
            </b-col>
            <b-col md="6" class="my-1">
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

        <!-- table contents -->
        <b-table
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

          <!-- X -->
          <template v-slot:cell(X)="row">
            <strong>Min : </strong> {{row.item.x_min.toFixed(8)}}<br><strong>Max : </strong> {{row.item.x_max.toFixed(8)}}
          </template>
          <!-- Y -->
          <template v-slot:cell(Y)="row">
            <strong>Min : </strong> {{row.item.y_min.toFixed(8)}}<br><strong>Max : </strong> {{row.item.y_max.toFixed(8)}}
          </template>
          <!-- Z -->
          <template v-slot:cell(Z)="row">
            <strong>Min : </strong> {{row.item.z_min.toFixed(8)}}<br><strong>Max : </strong> {{row.item.z_max.toFixed(8)}}
          </template>

          <!-- action status -->
          <template v-slot:cell(action)="row">
            <button type="button" class="btn-sm btn-primary" @click="openData(row.item)"
                    style="margin: 3px">Open
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

      </b-card>
    </b-col>
  </b-row>
  <view-bottom-wizard-button class="mt-2" index="2" :left_clicked="wizardButtonClicked('processwizard2')" :right_clicked="wizardButtonClicked('processwizard4')"/>
</div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {getData} from "../../libs/data";
  import LChartSeismic from "../components/LChartSeismic";
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTableWellHeader} from "../../libs/libVars";
  import {createTabProcessIcon, createTabProcessText} from "../../libs/libSeismicUi";

  export default {
    name: "ProcessWizardStep3",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      LChartSeismic
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data()
    {
      return {
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},
        perPageView: 15,
        perPage: 15,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableWellHeader(),
        table_datas: [],

        tabicon: ["fa fa-wpforms", "fa fa-map", "fa fa-window-restore", "fa fa-map-marker", "fa fa-line-chart", "fa fa-pie-chart"],
        tabtitle: ["Input Parameter", "Map Window", "Section", "Map Propagation", "Data Trend", "Recomendation"],
        colormap: 1,
        perc: 10,
        points: [],
        XAxis: {},
        YAxis: {},
        dataTitle: "",

        event_http_list :{success:"successList", fail:"failList"},
        event_http :{success:"success", fail:"fail"},
      }
    },

    beforeMount: function ()
    {
      this.getListWell();
    },

    methods: {
      getListWell() {
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/well/list", {}, this.event_http_list]).then();
      },

      getTabIcon()
      {
        return (createTabProcessIcon())
      },
      getTabText()
      {
        return (createTabProcessText())
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

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      wizardButtonClicked(str_router) {
        return(this.varRouter.getRoute(str_router, 1))
      }
    },
    mounted() {
      //-------------- LIST Well -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        //create table header
        this.table_headers.push({label: "Action", key:"action", default: "", tdClass: 'align-middle'});

        // //fill table contents
        this.table_datas = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
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
