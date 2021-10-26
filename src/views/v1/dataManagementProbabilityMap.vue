<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

        <div class="group-header">
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="showOrHideTableCheckbox"><i
            class="fa fa-check-square" v-b-tooltip.hover title="Hide checkbox table column"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="hideShowMarkerAll"><i
            class="fa fa-map-marker" v-b-tooltip.hover title="Hide all marker"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="getHttpRefreshProspectProject" v-b-tooltip.hover title="Refresh data"><i
            class="fa fa-refresh"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="gotoNewProspectPage"><i class="fa fa-plus" v-b-tooltip.hover
                                                                 title="New prospect data"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="openEditGroupDialog"><i class="fa fa-edit" v-b-tooltip.hover
                                                                 title="Edit group"/></ejs-button>
        </div>
        <vue-good-table
          max-height="75vh"
          ref="table-prospect"
          compactMode
          :columns="table_prospect_headers"
          :rows="table_prospect"
          styleClass="vgt-table bordered striped condensed"
          :line-numbers="true"
          :pagination-options="paginationOptions"
          :select-options="tableSelectAllOptions">
          <template slot="table-column" slot-scope="props">
           <span v-if="props.column.label =='Marker'">
              <i class="fa fa-map-marker"/>
           </span>
          </template>

          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field === 'score'">
              {{props.row.score.toFixed(3)}}
            </span>
            <span v-else-if="props.column.field === 'action'">
<!--              <ejs-button cssClass='e-success'-->
<!--                          v-on:click.native="eventEditProspectProjectClicked(props.row)">Edit</ejs-button>-->
<!--              <ejs-button cssClass='e-success mt-1'-->
<!--                          v-on:click.native="eventProspectAnalysisClicked(props.row)">Analysis</ejs-button>-->
              <ejs-button cssClass='e-success mt-1'
                          v-on:click.native="eventEditProspectAnalysisClicked(props.row)">Analysis</ejs-button>
            </span>
            <span v-else-if="props.column.field === 'star'">
              {{props.row.dmp.score.star}}
            </span>
<!--            <span v-else-if="props.column.field === 'marker'">-->
<!--              <span @click="eventSwitchLayerClicked(props.row.originalIndex, props.row)"-->
<!--                    :style="eventSelectedLayerCssStyle(props.row)">-->
<!--                <template v-if="props.row.dmp.marker.show">-->
<!--                  <i class="btn_toolbar fa fa-toggle-on"/>-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                  <i class="btn_toolbar fa fa-toggle-off"/>-->
<!--                </template>-->
<!--              </span>-->
<!--            </span>-->
          </template>
        </vue-good-table>

    <!-- show error dialog -->
    <vue-simple-dialog
      ref="dialogMessage"
      type="warning"
      :header="retStatus.title" body="Body"
      btn1_text="Tutup"
      btn1_style="success"
      @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.message}}</h5>
              </span>
    </vue-simple-dialog>

    <!-- save prospect dialog -->
    <vue-form-dialog
      ref="updateGroupDialog"
      type="default"
      header="Update Group" body="Body"
      btn1_text="Close" btn2_text="Save"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="updateGroupDialogBtn1Click()" @btn2Click="updateGroupDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="update_group_schema" :model="update_group_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';

  import 'vue-good-table/dist/vue-good-table.css'
  import {VueGoodTable} from 'vue-good-table';

  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  Vue.use(ButtonPlugin);

  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";

  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {
    createTableProspectProjectHeader_V1, createUpdateProspectGroupModel, createUpdateProspectGroupSchema
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    addShowKeyToLayer,
    createAreaDemoData,
    createAreaLeafletDemoData, createDemoProspectProjectList,
    createHeatmapDemoData
  } from "../../libs/demo_data";
  import {appDemoMode} from "../../_constant/http_api";

  export default {
    name: "dataManagementProbabilityMap",
    components: {
      VueSimpleDialog,

      VueGoodTable,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        bvalidate: false,

        bdemo: appDemoMode(),
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},

        paginationOptions: {
          enabled: true,
          mode: 'record',
          perPage: 10,
          perPageDropdown: [5, 10, 25, 50, 100],
          perPageDropdownEnabled: true,
          // infoFn: (params) => `my own page ${params.firstRecordOnPage}`,
        },
        tableSelectAllOptions: {
          enabled: false,
          selectOnCheckboxOnly: true,
          disableSelectInfo: false
        },

        tmp_array_autoupdate: [],
        table_prospect_headers: createTableProspectProjectHeader_V1(),
        table_prospect: [],
        selected_data: {},
        tmp_datas: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        update_group_model: createUpdateProspectGroupModel(),
        update_group_schema: createUpdateProspectGroupSchema(),

        event_http_area_list: {success: "successAreaList", fail: "failAreaList"},
        event_http_prospect_list: {success: "successProspectList", fail: "failProspectList"},
        event_http_prospect_update_group: {success: "successProspectUpdateGroup", fail: "failProspectUpdateGroup"},
      }
    },

    beforeMount: function () {
      if (this.bdemo) {
        // this.table_area = createAreaDemoData();
        // this.table_area = addPlotDataToTableArea(this.map_var, this.table_area);
        // this.table_area[0].heatmap_data = addShowKeyToLayer(createHeatmapDemoData());
        // this.table_area[0].heatmap_available = true;
        // this.table_prospect = createDemoProspectProjectList();
        // setDmpMarkerStatus(this.table_prospect, "marker", "show", false);

        this.showLoader = false;
      } else
        this.httpListArea();
    },

    watch:
      {},

    methods: {
      openEditGroupDialog()
      {
        let selected_rows = this.$refs['table-prospect'].selectedRows;
        let nd = selected_rows.length;
        if(nd === 0)
        {
          this.retStatus["title"] = "Information";
          this.retStatus["message"] = "No selected data";
          this.$refs.dialogMessage.showModal();
          return;
        }

        this.update_group_model["group"] = selected_rows[0]["group"];
        this.updateGroupDialogShow();
      },
      updateGroupDialogShow()
      {
        this.$refs.updateGroupDialog.showModal();
      },

      updateGroupDialogBtn1Click() {
        this.$refs.updateGroupDialog.hideModal();
      },
      updateGroupDialogBtn2Click() {
        if (!this.bvalidate) return;

        if(this.update_group_model["group"].trim().length === 0)
          return;

        this.onClickUpdateProspectGroup();
        this.$refs.updateGroupDialog.hideModal();
      },
      onClickUpdateProspectGroup()
      {
        let selected_rows = this.$refs['table-prospect'].selectedRows;
        let nd = selected_rows.length;
        if(nd === 0)
          return;

        let filename = [];
        for(let i=0; i<nd; i++)
        {
          filename.push({
            id_area: selected_rows[i]["id_area"],
            filename: selected_rows[i]["filename"]
          });
        }
        let param = {
          user: this.user["user"],
          data: {
            group: this.update_group_model["group"],
            list: filename
          }
        };
        // console.log(JSON.stringify(param))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-update-group"), param,
          this.event_http_prospect_update_group]).then();
      },

      showOrHideTableCheckbox()
      {
        this.tableSelectAllOptions["enabled"] = !this.tableSelectAllOptions["enabled"];
      },
      hideShowMarkerAll() {
        for (let i = 0; i < this.table_prospect.length; i++) {
          this.table_prospect[i].dmp.marker.show = false;
        }
        this.tmp_array_autoupdate = [];
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

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      httpListArea() {
        this.showLoader = true;
        let param = {
          // user: this.user["user"],
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), param, this.event_http_area_list]).then();
      },

      eventEditProspectProjectClicked(item) {
        // saveProspectData(item);

        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("prospect-edit", 1),
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      eventProspectAnalysisClicked(item) {
        // saveProspectData(item);

        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("prospect-analysis", 1),
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      eventEditProspectAnalysisClicked(item) {
        // saveProspectData(item);

        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("edit-prospect-analysis", 1),
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },

      getHttpRefreshProspectProject() {
        let param = {
          // user: this.user["user"],
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("prospect-list"), param, this.event_http_prospect_list]).then();
      },
      gotoNewProspectPage() {
        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("new-prospect-wizard", 1),
        });
        window.open(routeData.href, '_blank');
      },
    },
    mounted() {
      //-----------------------------------------------------------------
      // LIST AREA
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_area_list.success, (msg) => {
        // this.map_var = createAreaLeafletDemoData();
        this.table_area = msg.data; //fill table contents
        // this.table_area = addPlotDataToTableArea(this.map_var, this.table_area);

        this.getHttpRefreshProspectProject();
      });
      EventBus.$on(this.event_http_area_list.fail, (msg) => {
        this.showLoader = false;
        this.table_area = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROSPECT LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_list.success, (msg) => {
        this.table_prospect = msg.data;
        // setDmpMarkerStatus(this.table_prospect, "marker", "show", false);
        this.showLoader = false;
        // this.tmp_array_autoupdate = [];
      });
      EventBus.$on(this.event_http_prospect_list.fail, (msg) => {
        this.table_prospect = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROSPECT UPDATE GROUP
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_update_group.success, (msg) => {
        // this.getHttpRefreshProspectProject();
      });
      EventBus.$on(this.event_http_prospect_update_group.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_area_list.success);
      EventBus.$off(this.event_http_area_list.fail);
      EventBus.$off(this.event_http_prospect_list.success);
      EventBus.$off(this.event_http_prospect_list.fail);
      EventBus.$off(this.event_http_prospect_update_group.success);
      EventBus.$off(this.event_http_prospect_update_group.fail);

      this.showLoader = false;
    },
  }
</script>

<style>

</style>
