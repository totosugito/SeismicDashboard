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
            <div><span class="mr-2" style="color: #0d47a1"><strong>Section List <i class="fa fa-hand-o-right"></i></strong></span> Area : <strong>{{cur_area.area}}</strong>, Geobody : <strong>{{cur_area.geobody_name}}</strong></div>
          </div>

          <div>
            <b-row>
              <b-col md="5">
                <b-form-group label-cols="5" label-size="md" label="SEGY File">
                  <b-form-select v-model="cur_segy" :options="list_segy"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="5">
                <b-form-group label-cols="5" label-size="md" label="Radius">
                  <b-form-input size="md" v-model="radius"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col md="5">
                <b-btn class="btn btn-md" variant="success" @click="getListGather()">Show Gather</b-btn>
              </b-col>
            </b-row>
          </div>
          <!-- -------------------------------------------- -->
          <!-- TABLE -->
          <!-- -------------------------------------------- -->
          <!-- table header -->
          <div class="group-header">
            <b-row>
              <b-col md="6">
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

            <template v-slot:cell(eucd)="row">
              {{row.item.eucd.toFixed(5)}}
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

        </b-card>
      </b-col>
    </b-row>
      <view-bottom-wizard-button class="mt-2" index="2" :left_clicked="wizardButtonClicked('processwizard2')" :right_clicked="wizardButtonClicked('processwizard4')"/>

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
  import {createTableGatherHeader, createTableSectionHeader, createTableWellHeader, createTableWellHeaderBySelectedGeobody} from "../../libs/libVars";
  import {createTabProcessIcon, createTabProcessText} from "../../libs/libSeismicUi";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'

  export default {
    name: "ProcessWizardStep3_2",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      LChartSeismic,
      VueSimpleDialog
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
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        perPageView: 15,
        perPage: 15,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableSectionHeader(),
        table_datas: [],
        radius: 0,
        cur_segy: {},
        list_segy: [],
        cur_area: {},

        event_http_list: {success: "successList", fail: "failList"},
        event_http: {success: "success", fail: "fail"},
      }
    },

    beforeMount: function ()
    {
      this.getListSegy();
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
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/segy/file-list", {}, this.event_http]).then();
      },
      getListGather()
      {
        this.showLoader = true;
        let geobody_file_id = this.$route.query.geobody_file_id;
        let geobody_id = this.$route.query.geobody_id;
        let param = {
          geobody_file_id: geobody_file_id,
          geobody_id: geobody_id,
          segy_file_id: this.cur_segy,
          radius: this.radius
        };
        // param = {"geobody_file_id": "5f70dacf6180bd82dd6637a3",
        //   "geobody_id": "220538",
        //   "segy_file_id": "5f770203f0522ed909b6d573",
        //   "radius": 10};
        this.$store.dispatch('http_post', ["/api/geobody/find-section", param, this.event_http_list]).then();
      },

      getTabIcon()
      {
        return (createTabProcessIcon())
      },
      getTabText()
      {
        let tab_text = createTabProcessText();
        tab_text[2] = "Section List";
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
        this.table_datas = [];
        let iline = msg["list_iline"];
        let xline = msg["list_xline"];
        for(let i=0; i<iline.length; i++)
        {
          this.table_datas.push({
            iline: iline[i]["iline"],
            xline: "-",
            freq: iline[i]["freq"],
            segy_file_id: iline[i]["segy_file_id"],
          })
        }
        for(let i=0; i<xline.length; i++)
        {
          this.table_datas.push({
            iline: "-",
            xline: xline[i]["xline"],
            freq: xline[i]["freq"],
            segy_file_id: xline[i]["segy_file_id"],
          })
        }

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
        for(let i=0; i<msg.length; i++)
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
