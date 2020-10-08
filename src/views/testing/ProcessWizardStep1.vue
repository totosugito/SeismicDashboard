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
      </pane>
      <pane class="pl-2 pt-2 pb-2 pr-0">
        <div class="col p-0" style="height: 100%; width: 100%">
          <vue-leaflet-map :markers="markers" :center="center"/>
        </div>
      </pane>
    </splitpanes>

<!--        </b-card>-->
<!--      </b-col>-->
<!--    </b-row>-->
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

<!--    <view-bottom-wizard-button class="mt-2" index="0" left_clicked="" :right_clicked="wizardButtonClicked('processwizard2')"/>-->

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
  import {createTableAreaListHeader} from "../../libs/libVars";
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'

  export default {
    name: "ProcessWizardStep1",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueLeafletMap,
      VueFormDialog,
      VueSimpleDialog,
      "vue-form-generator": VueFormGenerator.component,
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

        table_headers: createTableAreaListHeader(),
        table_datas: [],
        geobody_data: [],
        selected_data: {},

        model: {
          file_id: "",
          // radius: 0,
        },
        schema: {
          fields: [
            {
              type: 'select',
              label: 'Select File',
              model: 'file_id',
              selectOptions: {hideNoneSelectedText: true}
            },
            // {
            //   type: 'input',
            //   inputType: 'text',
            //   label: 'Radius',
            //   model: 'radius',
            //   placeholder: 'Set Radius',
            //   featured: true,
            //   required: true
            // },
          ]
        },
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
      this.getListGeobody();
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
      openData(item)
      {
        this.selected_data = item;
        this.$refs.radiusDialog.showModal();
      },
      radiusDialogBtn1Click() {
        this.$refs.radiusDialog.hideModal();
      },
      radiusDialogBtn2Click() {
        if(!this.bvalidate) return;
        if(this.model["file_id"]==="")
          return;

        for(let i=0; i<this.geobody_data.length; i++)
        {
          if(this.geobody_data[i]["id"] === this.model["file_id"])
          {
            this.selected_data["geobody_name"] = this.geobody_data[i]["name"];
            break;
          }
        }
        this.selected_data["file_id"] = this.model["file_id"];
        // console.log(JSON.stringify(this.selected_data))
        // console.log(JSON.stringify(this.geobody_data))

        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: this.varRouter.getRoute("processwizard2", 1),
        });

        this.$refs.radiusDialog.hideModal();
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

      getListGeobody() {
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/geobody/file-list", {}, this.event_http_list_geo]).then();
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
        this.table_datas = msg; //fill table contents
        this.center = L.latLng(msg[0].lat, msg[0].lon);

        this.markers = [];
        for (let i=0; i<msg.length; i++)
        {
          let item = msg[i];
          let mm = {
            id: i,
            area: msg[i].area,
            latlng: L.latLng(item.lat, item.lon),
            popup : this.createCustomMarkerPopup(item),
            icon: new L.DivIcon({
              html: this.createDemoCss("#990000")
            })
          };
          this.markers.push(mm);
        }

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
        for(let i=0; i<msg.length; i++)
          this.geobody_data.push({id: msg[i]["_id"]["$oid"], name:msg[i]["file_name"]})
        this.schema.fields[0].values = this.geobody_data;
        this.getListArea(); //read area
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
</style>
