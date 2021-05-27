<template>
  <div>
    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="tabIndex" :textsize="190"
                                class="mb-3"/>
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
            <div><span class="mr-2" style="color: #0d47a1"><strong>Probability <i
              class="fa fa-hand-o-right"></i></strong>
            </span>
              Area : <strong>{{cur_area.name}}</strong>
              <template v-if="pageMode===0">
                &nbsp;&nbsp;&rarr;&nbsp;&nbsp;Geobody ID : <strong>{{cur_geobody.geobody_id}}</strong>
              </template>
            </div>
          </div>
          <div>
            <b-row>
              <b-col md="6">
                <template v-if="pageMode===0">
                  <b-btn class="btn btn-md mr-1" variant="success" @click="openAvaDialog()">AVA Geobody</b-btn>
                </template>
                <template v-else>
                  <b-btn class="btn btn-md mr-1" variant="success" @click="openAvaDialog()">AVA xyz</b-btn>
                </template>

                <b-btn class="btn btn-md mr-1" variant="warning" @click="openAva3dChart()">AVA 3D Chart</b-btn>
                <b-btn class="btn btn-md ml-5 mr-1" variant="primary" @click="openProbDialog()">Calculate Prob
                </b-btn>
                <b-dropdown right variant="warning" text="Prob 3D Chart">
                  <b-dropdown-item @click="openAva3dProbChart('prob1')">Prob 1</b-dropdown-item>
                  <b-dropdown-item @click="openAva3dProbChart('prob2')">Prob 2</b-dropdown-item>
                  <b-dropdown-item @click="openAva3dProbChart('cal_prob')">Calc. Prob</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col md="5">
                <!--                    <b-btn class="btn btn-md" variant="success" @click="getListFindAVA()">Find AVA</b-btn>-->
              </b-col>
            </b-row>
          </div>
          <b-tabs class="mt-1">
            <b-tab title="AVA" pills card>
              <!-- -------------------------------------------- -->
              <!-- TABLE AVA -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="3" class="my-1">
                    <b-form-checkbox
                      id="checkbox-1"
                      v-model="bCheckAll"
                      name="checkbox-1"
                      @change="selectAllChecked()">
                      Check All
                    </b-form-checkbox>
                  </b-col>
                  <b-col md="3" class="my-1">
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
                :items="table_ava">

                <template v-slot:cell(check)="row">
                  <input type="checkbox" v-model="row.item.check" @click="updateSelectedRow(row.item)"/>
                </template>

                <template v-slot:cell(cdp_x)="row">
                  {{row.item.cdp_x.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_y)="row">
                  {{row.item.cdp_y.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_z)="row">
                  {{row.item.cdp_z.toFixed(3)}}
                </template>
                <template v-slot:cell(prob1)="row">
                  {{parseProbabilityNumber(row.item.prob1)}}
                </template>
                <template v-slot:cell(prob2)="row">
                  {{parseProbabilityNumber(row.item.prob2)}}
                </template>
                <template v-slot:cell(cal_prob)="row">
                  {{parseProbabilityNumber(row.item.cal_prob)}}
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
            </b-tab>
            <b-tab title="Probability" pills card>
              <!-- -------------------------------------------- -->
              <!-- TABLE PROBABILITY -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="3" class="my-1">
                    <b-form-checkbox
                      id="checkbox-2"
                      v-model="bCheckAllProb"
                      name="checkbox-2"
                      @change="selectAllCheckedProb()">
                      Check All
                    </b-form-checkbox>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <strong>Total : {{ndata_prob}}</strong>
                  </b-col>
                  <b-col md="6" class="my-1">
                    <b-form-group label-cols-lg="4" label-cols-md="3" label-cols-sm="6" class="mb-0">
                      <b-input-group prepend="Filter : ">
                        <b-form-input v-model="filterProb" placeholder="Search"/>
                        <b-input-group-append>
                          <b-btn :disabled="!filterProb" @click="filterProb = ''">Clear</b-btn>
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
                :current-page="currentPageProb"
                :per-page="perPageProb"
                :filter="filterProb"
                @filtered="onFilteredProb"
                :fields="table_headers_prob"
                :items="table_prob">

                <template v-slot:cell(check)="row">
                  <input type="checkbox" v-model="row.item.check" @click="updateSelectedRow(row.item)"/>
                </template>

                <template v-slot:cell(cdp_x)="row">
                  {{row.item.cdp_x.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_y)="row">
                  {{row.item.cdp_y.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_z)="row">
                  {{row.item.cdp_z.toFixed(3)}}
                </template>
                <template v-slot:cell(prob1)="row">
                  {{parseProbabilityNumber(row.item.prob1)}}
                </template>
                <template v-slot:cell(prob2)="row">
                  {{parseProbabilityNumber(row.item.prob2)}}
                </template>
                <template v-slot:cell(cal_prob)="row">
                  {{parseProbabilityNumber(row.item.cal_prob)}}
                </template>

                <!-- action status -->
                <template v-slot:cell(action)="row">
                  <b-link :href="openDataUrl(row.item)" @click="openData(row.item)">Open</b-link>
                </template>
              </b-table>

              <!-- table footer -->
              <b-row>
                <b-col md="8" class="my-1">
                  <b-pagination :total-rows="computeTotalRowProb()" :per-page="perPageProb" v-model="currentPageProb"
                                class="my-0"/>
                </b-col>
                <b-col md="4" class="my-1">
                  <b-input-group prepend="Per Page : ">
                    <b-form-select :options="pageOptions" v-model="perPageViewProb" v-on:change="showPerPageProb"/>
                  </b-input-group>
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>

    <template v-if="pageMode===0">
      <view-bottom-wizard-button class="mt-0" index="1" :left_clicked="wizardButtonClicked('processwizard2-0')"
                                 :right_clicked="wizardButtonClicked('processwizard3')"/>
    </template>
    <template v-else>
      <view-bottom-wizard-button class="mt-0" index="1" :left_clicked="wizardButtonClicked('processwizard1')"
                                 :right_clicked="wizardButtonClicked('processwizard3')"/>
    </template>

    <vue-form-dialog
      ref="avaDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="avaDialogBtn1Click()" @btn2Click="avaDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="schema_ava" :model="model_ava" :options="formOptions"
                                  @validated="onValidated"/>
        <template v-if="pageMode === 1">
                <vue-leaflet-single-marker-map :map_var="map_var" :marker="marker"
                                               @updateMarkerPosition="updateMarkerPosition" style="height: 300px"/>
          </template>
            </span>
    </vue-form-dialog>

    <vue-form-dialog
      ref="probDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="probDialogBtn1Click()" @btn2Click="probDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="prob_schema" :model="prob_model" :options="formOptions"
                                  @validated="onValidated"/>
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
                <h5>{{retStatus.mesg}}</h5>
              </span>
    </vue-simple-dialog>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {
    createAvaPointModel, createAvaPointSchema,
    createAvaGeobodyModel, createAvaGeobodySchema,
    createTableAvaHeaderV0,
    createTableProbHeaderV0, createProbModel, createProbSchema
  } from "../../libs/libVars";
  import {createTabProcessIconV0, createTabProcessTextV0} from "../../libs/libSeismicUi";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueLeafletSingleMarkerMap from '../components/vue-leaflet-single-marker-map'

  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {
    createAreaLeafletDemoData,
    createAvaDemoData,
    createDemoAvaGeobodyParam,
    createDemoAvaPointParam, createDemoProbParam,
    createProbDemoData
  } from "../../libs/demo_data";
  import {appDemoMode} from "../../_constant/http_api";
  import {fillLeafletAreaVariable} from "../../libs/simpleLib";

  export default {
    name: "ProcessWizardStep2_1",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      VueSimpleDialog,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
      VueLeafletSingleMarkerMap
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        proc_completed: false,
        showLoader: false,

        marker: {lat: 0, lng: 0},
        map_var: {},

        pageMode: 0,
        tabIndex: 1,
        cur_area: {},
        cur_geobody: {},
        retStatus: {status: 0, title: "Info", mesg: "", data: []},

        selected_check_ava: [],
        bCheckAll: false,
        perPageView: 10,
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        filter: null,
        ndata: 0,
        table_headers: createTableAvaHeaderV0(),
        table_ava: [],
        schema_ava: {},
        model_ava: {},

        bCheckAllProb: false,
        perPageViewProb: 10,
        perPageProb: 10,
        currentPageProb: 1,
        totalRowsProb: 0,
        filterProb: null,
        ndata_prob: 0,
        table_headers_prob: createTableProbHeaderV0(),
        table_prob: [],
        prob_model: createProbModel(),
        prob_schema: createProbSchema(),

        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list_sgy: {success: "successListSgy", fail: "failListSgy"},
        event_http_list_mlmodel: {success: "successListML", fail: "failListML"},
        event_http_list_ava: {success: "successListAva", fail: "failListAva"},
        event_http_list_prob: {success: "successListProb", fail: "failListProb"},
        event_http_ava_plot: {success: "successListAvaPlot", fail: "failListAvaPlot"},
      }
    },

    beforeMount: function () {
      this.cur_area = this.$store.getters.readSelectedArea;
      this.map_var = createAreaLeafletDemoData();
      this.map_var = fillLeafletAreaVariable(this.map_var, this.cur_area["coordinate"], 0);
      this.marker = this.map_var["center"];

      this.pageMode = this.$route.query.mode * 1;
      if (this.pageMode === 0) {
        this.tabIndex = 2;
        this.cur_geobody = this.$store.getters.readSelectedGeobody;
      } else this.tabIndex = 1;

      this.initSchemaAndModelData();

      if (appDemoMode() === true) {
        this.table_ava = createAvaDemoData();
        this.table_prob = createProbDemoData();

        this.$store.dispatch('actionSaveAvaList', this.table_ava); //set selected project
        this.$store.dispatch('actionSaveProbList', this.table_prob); //set selected project
      }
      // else
      this.getListSegy();
    },

    methods: {
      updateMarkerPosition(v) {
        this.marker = v;
        this.model_ava["xline"] = this.marker["lng"];
        this.model_ava["iline"] = this.marker["lat"];
      },
      updateSelectedRow(m) {
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

      selectAllChecked() {
        for (let i = 0; i < this.table_ava.length; i++)
          this.table_ava[i]["check"] = !this.bCheckAll;
      },
      selectAllCheckedProb() {
        for (let i = 0; i < this.table_prob.length; i++)
          this.table_prob[i]["check"] = !this.bCheckAllProb;
      },
      parseProbabilityNumber(v) {
        if (v === undefined)
          return ("");
        else
          return (v.toFixed(6));
      },

      openAva3dChart() {
        window.open('#/ava3dview', '_blank');
      },
      openAva3dProbChart(str_type) {
        window.open('#/prob3dview?type=' + str_type, '_blank');
      },

      initSchemaAndModelData() {
        if (this.pageMode === 0) {
          this.schema_ava = createAvaGeobodySchema();
          this.model_ava = createAvaGeobodyModel();
        } else {
          this.schema_ava = createAvaPointSchema();
          this.model_ava = createAvaPointModel();
          this.model_ava["xline"] = this.marker["lng"];
          this.model_ava["iline"] = this.marker["lat"];
        }
      },
      //------------------------- ava dialog ----------------------------
      openAvaDialog() {
        this.$refs.avaDialog.showModal();
      },
      avaDialogBtn1Click() {
        this.$refs.avaDialog.hideModal();
      },
      avaDialogBtn2Click() {
        let param = {};
        if (appDemoMode() === true) {
          if (this.pageMode === 0)
            param = createDemoAvaGeobodyParam();
          else
            param = createDemoAvaPointParam();
        } else {
          if (!this.bvalidate) return;
          if (this.model_ava["gather_file_name"] === "")
            return;
          if (this.model_ava["substack_file_name"] === "")
            return;

          if (this.pageMode === 0)
            param = {
              id_area: this.cur_area["id_area"],
              gather_file_name: this.model_ava["gather_file_name"],
              substack_file_name: this.model_ava["substack_file_name"],
              geobody_id: this.cur_geobody["geobody_id"],
              rad_x: this.model_ava["rad_x"],
              rad_y: this.model_ava["rad_y"],
              rad_z: this.model_ava["rad_z"],
            };
          else
            param = {
              id_area: this.cur_area["id_area"],
              gather_file_name: this.model_ava["gather_file_name"],
              substack_file_name: this.model_ava["substack_file_name"],
              radius: this.model_ava["radius"],
              type: this.model_ava["type"],
              xline: this.model_ava["xline"],
              iline: this.model_ava["iline"],
              cdp_z: this.model_ava["cdp_z"],
              rad_x: this.model_ava["rad_x"],
              rad_y: this.model_ava["rad_y"],
              rad_z: this.model_ava["rad_z"],
            };
        }
        this.showLoader = true;
        if (this.pageMode === 0)
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("geobody-ava-list"), param, this.event_http_list_ava]).then();
        else
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("point-ava-list"), param, this.event_http_list_ava]).then();

        this.$refs.avaDialog.hideModal();
      },

      openProbDialog() {
        this.$refs.probDialog.showModal();
      },
      probDialogBtn1Click() {
        this.$refs.probDialog.hideModal();
      },
      probDialogBtn2Click() {
        let param = {};
        if (appDemoMode() === true) {
          createDemoProbParam();
        } else {
          if (!this.bvalidate) return;
          if (this.prob_model["label_name"] === "")
            return;

          let tmp_table_datas = [];
          for (let i = 0; i < this.table_ava.length; i++) {
            let m = this.table_ava[i];
            if (("check" in m)) {
              if (m["check"] === true) {
                // delete m["check"];
                tmp_table_datas.push(m);
              }
            }
          }
          param = {
            id_area: this.cur_area["id_area"],
            mlmodel_label_name: this.prob_model["label_name"],
            data: tmp_table_datas
          };
        }

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("point-calc-prob"), param, this.event_http_list_prob]).then();

        this.$refs.probDialog.hideModal();
      },

      openData(item) {
        // this.$router.push({
        //   path: "process-wizard3",
        //   query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"]}
        // });
      },
      openDataUrl(item) {
        return ("");
        // return("#/process-wizard3?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },

      getListSegy() {
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-list"), this.cur_area, this.event_http_list_sgy]).then();
      },
      getMlModelFile() {
        this.showLoader = true;
        let param = {
          "data": this.cur_area
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("mlmodel-list"), param, this.event_http_list_mlmodel]).then();
      },

      getTabIcon() {
        return (createTabProcessIconV0(this.pageMode))
      },
      getTabText() {
        let tab_text = createTabProcessTextV0(this.pageMode);
        return (tab_text)
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_ava.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_ava.length);
        } catch (e) {
          return (0);
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },

      // --------------------------------
      showPerPageProb(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPageProb = this.table_prob.length;
        else
          this.perPageProb = selected_per_page;
        this.perPageViewProb = selected_per_page;
      },
      computeTotalRowProb() {
        try {
          return (this.table_prob.length);
        } catch (e) {
          return (0);
        }
      },
      onFilteredProb(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRowsProb = filteredItems.length;
        this.currentPageProb = 1;
      },

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      wizardButtonClicked(str_router) {
        return (this.varRouter.getRoute(str_router, 1))
      }
    },
    mounted() {
      //-------------- LIST SGY -------------------
      EventBus.$on(this.event_http_list_sgy.success, (msg) => {
        let list_segy = [];
        for (let i = 0; i < msg["data"].length; i++) {
          list_segy.push({
            value: msg["data"][i]["label_name"],
            text: msg["data"][i]["label_name"],
            id: msg["data"][i]["label_name"],
            name: msg["data"][i]["label_name"]
          });
        }
        this.schema_ava.fields[0].values = list_segy;
        this.schema_ava.fields[1].values = list_segy;

        let tmp_data_type = [
          {
            id: "ilxl",
            name: "Inline/Xline"
          },
          {
            id: "xyz",
            name: "XYZ"
          },
        ];
        this.schema_ava.fields[2].values = tmp_data_type;
        this.getMlModelFile();
      });
      EventBus.$on(this.event_http_list_sgy.fail, (msg) => {
        this.showLoader = false;
        this.table_ava = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST ML Pick -------------------
      EventBus.$on(this.event_http_list_mlmodel.success, (msg) => {
        let list_mlmodel = [];
        for (let i = 0; i < msg["data"].length; i++) {
          list_mlmodel.push({
            value: msg["data"][i]["label_name"],
            text: msg["data"][i]["label_name"],
            id: msg["data"][i]["label_name"],
            name: msg["data"][i]["label_name"]
          });
        }
        this.prob_schema.fields[0].values = list_mlmodel;
        this.showLoader = false;
      });

      EventBus.$on(this.event_http_list_mlmodel.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST AVA -------------------
      EventBus.$on(this.event_http_list_ava.success, (msg) => {
        this.table_ava = msg["data"];
        this.ndata = this.table_ava.length;
        if (this.ndata <= 0) {
          this.retStatus["mesg"] = msg["mesg"];
          this.$refs.dialogMessage.showModal();
          this.showLoader = false;
          return;
        }

        let segy_file_id = this.model_ava["gather_file_name"];
        for (let i = 0; i < this.table_ava.length; i++) {
          this.table_ava[i]["gather_file_name"] = segy_file_id;
        }

        this.$store.dispatch('actionSaveAvaList', this.table_ava); //set selected project
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_ava.fail, (msg) => {
        this.showLoader = false;
        this.table_ava = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST PROB -------------------
      EventBus.$on(this.event_http_list_prob.success, (msg) => {
        this.table_prob = msg["data"];
        for (let i = 0; i < this.table_prob.length; i++)
          this.table_prob[i]["check"] = false;

        this.ndata_prob = this.table_prob.length;
        this.$store.dispatch('actionSaveProbList', this.table_prob); //set selected project
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_prob.fail, (msg) => {
        this.showLoader = false;
        this.table_prob = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list_sgy.success);
      EventBus.$off(this.event_http_list_sgy.fail);
      EventBus.$off(this.event_http_list_mlmodel.success);
      EventBus.$off(this.event_http_list_mlmodel.fail);
      EventBus.$off(this.event_http_list_ava.success);
      EventBus.$off(this.event_http_list_ava.fail);
      EventBus.$off(this.event_http_list_prob.success);
      EventBus.$off(this.event_http_list_prob.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
</style>
