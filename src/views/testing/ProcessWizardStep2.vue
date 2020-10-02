<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

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

          <template v-slot:cell(action)="row">
              <b-link :href="openDataUrl(row.item)" @click="openData(row.item)">Open</b-link>
          </template>

          <!-- X -->
          <template v-slot:cell(xcoord)="row">
            <strong>Min : </strong> {{row.item.x_min.toFixed(4)}}<br><strong>Max : </strong> {{row.item.x_max.toFixed(4)}}
          </template>
          <!-- Y -->
          <template v-slot:cell(ycoord)="row">
            <strong>Min : </strong> {{row.item.y_min.toFixed(4)}}<br><strong>Max : </strong> {{row.item.y_max.toFixed(4)}}
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
<!--          <vue-leaflet-heatmap :markers="markers" :center="center"/>-->
          <vue-leaflet-map :markers="markers" :center="center"/>
        </div>
      </pane>
    </splitpanes>

    <view-bottom-wizard-button class="mt-2" index="1" :left_clicked="wizardButtonClicked('processwizard1')" :right_clicked="wizardButtonClicked('processwizard3')"/>

    <vue-form-dialog
      ref="radiusDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="radiusDialogBtn1Click()" @btn2Click="radiusDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>

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
  import {createTableAreaListHeader, createTableGeobodyListHeader} from "../../libs/libVars";
  // import VueLeafletHeatmap from "../components/vue-leaflet-heatmap";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";

  export default {
    name: "ProcessWizardStep2",

    components: {
      // VueLeafletHeatmap,
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueSimpleDialog,
      VueLeafletMap,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
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

        cur_well: {},
        cur_tab: 0,
        center: L.latLng(-6.90389, 107.61861),
        markers: [],
        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableGeobodyListHeader(),
        table_datas: [],

        model: {
          radius: 0,
        },
        schema: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'Radius',
              model: 'radius',
              placeholder: 'Set Radius',
              featured: true,
              required: true
            },
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
        event_http: {success: "success", fail: "fail"},
      }
    },

    beforeMount: function ()
    {
      this.getListGeobodyData();
    },

    methods: {
      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      //MESSAGE HTTP I/O
      dialogMessageBtn1Click() {
        if (this.retStatus.status === -1) { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        } else { //error token
          this.$refs.dialogMessage.hideModal();
        }
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

      getListGeobodyData()
      {
        this.showLoader = true;
        this.cur_well = this.$store.getters.readSelectedWell;
        this.center = L.latLng(this.cur_well.lat, this.cur_well.lon);

        this.$store.dispatch('http_post', ["/api/geobody/info-list", this.cur_well, this.event_http_list]).then();
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

      openData(item)
      {
        //this.varRouter.getRoute("seismicviewer", 1),
        this.$router.push({
          path: "3dview",
          query: {file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"]}
        });

        // this.wizardButtonClicked('processwizard3');
        // this.selected_data = item;
        // this.$refs.radiusDialog.showModal();
      },
      openDataUrl(item)
      {
        return("#/3dview?file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },

      radiusDialogBtn1Click() {
        this.$refs.radiusDialog.hideModal();
      },
      radiusDialogBtn2Click() {
        if (!this.bvalidate) return;
        // this.selected_data["radius"] = this.model["radius"];
        // this.selected_data["file_id"] = this.model["file_id"];
        //console.log(JSON.stringify(this.selected_data))
        // this.wizardButtonClicked('processwizard3');
        // this.$store.dispatch('actionSaveSelectedWell', this.selected_data); //set selected project
        this.$router.push({
          path: this.varRouter.getRoute("processwizard3", 1),
        });

        this.$refs.radiusDialog.hideModal();
      },
    },
    mounted()
    {
      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) =>
      {
        // console.log(JSON.stringify(msg))
        this.table_datas = msg; //fill table contents
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
