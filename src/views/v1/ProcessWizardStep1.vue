<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <!--    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="cur_tab" :textsize="190"-->
    <!--                                class="mb-3"/>-->

    <b-row style="height: 88vh">
      <b-col md="8">
        <div>
          <!--          <b-card no-body>-->
          <b-tabs v-model="tabIndex">
            <b-tab title="Data by FIELD" :title-link-class="linkClass(0)">Tab contents 1</b-tab>
            <b-tab title="Data by WELL" :title-link-class="linkClass(1)">Tab contents 2</b-tab>
            <b-tab title="Well Files" :title-link-class="linkClass(2)">Tab contents 3</b-tab>
            <b-tab no-body title="Seismic Files" :title-link-class="linkClass(3)">

              <b-row>
                <b-col md="4">
                  <b-table style="height: 30vh"
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

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
                <b-col md="4">
                  <b-table style="height: 30vh"
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
                           :fields="table_headers2"
                           :items="tmp_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
                <b-col md="4">
                  <b-table style="height: 30vh"
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
                           :fields="table_headers3"
                           :items="tmp_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-table style="height: 45vh"
                           show-empty
                           sticky-header="80vh"
                           :small="true"
                           :striped="true"
                           :bordered="true"
                           :outlined="true"
                           :current-page="currentPage"
                           :per-page="perPage"
                           :filter="filter"
                           @filtered="onFiltered"
                           :fields="table_headers4"
                           :items="tmp_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
          <!--          </b-card>-->
        </div>
      </b-col>
      <b-col md="4">
        <!--        <div class="col p-0" style="height: 100%; width: 100%">-->
        <template v-if="showLoader===false">
          <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">
            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"></l-tile-layer>
            <template v-for="(item, idx_poly) in map_polygon">
              <l-polygon :lat-lngs="item.polygon" :color="item.color">
                <l-popup :content="item.name"/>
              </l-polygon>
            </template>

            <LHeatmap
              :latLngs="markers_heatmap"
              :radius="15"
              :blur="15"
              :minOpacity="0.1"
              :max="1.5"
            />
          </l-map>
        </template>
        <!--        </div>-->
      </b-col>
    </b-row>


    <!--    <splitpanes class="default-theme" vertical style="height: 74vh" vertical>-->
    <!--      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">-->
    <!--        &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
    <!--        &lt;!&ndash; TABLE &ndash;&gt;-->
    <!--        &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
    <!--        &lt;!&ndash; table header &ndash;&gt;-->
    <!--        <div class="group-header">-->
    <!--          <b-row>-->
    <!--            <b-col md="2" class="my-1">-->
    <!--            </b-col>-->
    <!--            <b-col md="10" class="my-1">-->
    <!--              <b-form-group label-cols-lg="4" label-cols-md="3" label-cols-sm="6" class="mb-0">-->
    <!--                <b-input-group prepend="Filter : ">-->
    <!--                  <b-form-input v-model="filter" placeholder="Search"/>-->
    <!--                  <b-input-group-append>-->
    <!--                    <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>-->
    <!--                  </b-input-group-append>-->
    <!--                </b-input-group>-->
    <!--              </b-form-group>-->
    <!--            </b-col>-->
    <!--          </b-row>-->
    <!--        </div>-->

    <!--        <b-table-->
    <!--          show-empty-->
    <!--          sticky-header="53vh"-->
    <!--          :small="true"-->
    <!--          :striped="true"-->
    <!--          :bordered="true"-->
    <!--          :outlined="true"-->
    <!--          :current-page="currentPage"-->
    <!--          :per-page="perPage"-->
    <!--          :filter="filter"-->
    <!--          @filtered="onFiltered"-->
    <!--          :fields="table_headers"-->
    <!--          :items="table_datas">-->

    <!--          <template v-slot:cell(id_color)="row">-->
    <!--&lt;!&ndash;            <template v-if="row.item.plot===true">&ndash;&gt;-->
    <!--&lt;!&ndash;              <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>&ndash;&gt;-->
    <!--&lt;!&ndash;            </template>&ndash;&gt;-->
    <!--&lt;!&ndash;            <template v-else>&ndash;&gt;-->
    <!--              <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>-->
    <!--&lt;!&ndash;            </template>&ndash;&gt;-->
    <!--          </template>-->
    <!--          <template v-slot:cell(action)="row">-->
    <!--            <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>-->
    <!--            <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>-->
    <!--          </template>-->
    <!--        </b-table>-->

    <!--        &lt;!&ndash; table footer &ndash;&gt;-->
    <!--        <b-row>-->
    <!--          <b-col md="8" class="my-1">-->
    <!--            <b-pagination :total-rows="computeTotalRow()" :per-page="perPage" v-model="currentPage" class="my-0"/>-->
    <!--          </b-col>-->
    <!--          <b-col md="4" class="my-1">-->
    <!--            <b-input-group prepend="Per Page : ">-->
    <!--              <b-form-select :options="pageOptions" v-model="perPageView" v-on:change="showPerPage"/>-->
    <!--            </b-input-group>-->
    <!--          </b-col>-->
    <!--        </b-row>-->
    <!--      </pane>-->
    <!--      <pane class="pl-2 pt-2 pb-2 pr-0">-->
    <!--        <div class="col p-0" style="height: 100%; width: 100%">-->
    <!--          <template v-if="showLoader===false">-->
    <!--            <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"-->
    <!--                   :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">-->
    <!--              <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"></l-tile-layer>-->
    <!--              <template v-for="(item, idx_poly) in map_polygon">-->
    <!--                <l-polygon :lat-lngs="item.polygon" :color="item.color">-->
    <!--                <l-popup :content="item.name" />-->
    <!--                </l-polygon>-->
    <!--              </template>-->
    <!--            </l-map>-->
    <!--          </template>-->
    <!--        </div>-->
    <!--      </pane>-->
    <!--    </splitpanes>-->

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
  import {createTabProcessIconV0, createTabProcessTextV0} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import LHeatmap from "../components/Vue2LeafletHeatmap";
  import {
    createTableAreaListHeader, createTableAreaListHeader2_V1, createTableAreaListHeader3_V1,
    createTableAreaListHeader_V1,
    createTableAreaListHeaderV0, createTableAvaHeaderV0
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    fillLeafletAreaVariable,
    getBoundaryData,
    createLeafletColormap,
    createLeafletAreaPolygon
  } from "../../libs/simpleLib";
  import {createAreaLeafletDemoData} from "../../libs/demo_data";

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "ProcessWizardStep1",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueLeafletMap,
      VueSimpleDialog,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip,
      LHeatmap
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
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},

        tabIndex: 3,
        cur_tab: 0,

        map_var: {},
        map_polygon: [],

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableAreaListHeader_V1(),
        table_headers2: createTableAreaListHeader2_V1(),
        table_headers3: createTableAreaListHeader3_V1(),
        table_headers4: createTableAvaHeaderV0(),
        table_datas: [],
        selected_data: {},
        tmp_datas: [],
        markers_heatmap: [[9892410.38,539783.02,0],[9892446.05,539747.97,0],[9892481.71,539712.93,0],[9892517.37,539677.88,0],[9892553.03,539642.84,3.2232451],[9892588.7,539607.79,2.6960244],[9892624.36,539572.74,2.8892214],[9892660.02,539537.7,6.013168],[9892695.68,539502.65,8.598647],[9892731.35,539467.61,4.267123],[9892767.01,539432.56,4.951923],[9892802.67,539397.52,6.1742716],[9892838.33,539362.47,4.040646],[9892874,539327.43,3.1925428],[9892909.66,539292.38,3.4570131],[9892945.32,539257.34,5.5708585],[9892980.98,539222.29,6.6529746],[9893016.65,539187.24,4.5757856],[9893052.31,539152.2,6.0856733],[9893087.97,539117.15,8.633948],[9893123.63,539082.11,11.188945],[9893159.3,539047.06,6.105748],[9893194.96,539012.02,4.5932083],[9893230.62,538976.97,7.542396],[9893266.28,538941.93,10.600707],[9893301.95,538906.88,12.510892],[9893337.61,538871.84,16.875862],[9893373.27,538836.79,13.403075],[9893408.93,538801.74,9.13362],[9893444.6,538766.7,10.224214],[9893480.26,538731.65,11.208454],[9893515.92,538696.61,9.834759],[9893551.58,538661.56,9.655937],[9893587.25,538626.52,7.191958],[9893622.91,538591.47,12.24922],[9893658.57,538556.43,11.520903],[9893694.23,538521.38,7.056862],[9893729.9,538486.33,11.543195],[9893765.56,538451.29,12.991705],[9893801.22,538416.24,12.106399],[9893836.88,538381.2,14.754339],[9893872.55,538346.15,15.272509],[9893908.21,538311.11,16.31688],[9893943.87,538276.06,13.14839],[9893979.53,538241.02,16.163565],[9894015.2,538205.97,17.654903],[9894050.86,538170.93,14.700766],[9894086.52,538135.88,15.922283],[9894122.18,538100.83,26.012238],[9894157.85,538065.79,29.536861],[9894193.51,538030.74,21.829561],[9894229.17,537995.7,15.094323],[9894264.83,537960.65,11.2523155],[9894300.5,537925.61,9.791954],[9894336.16,537890.56,6.378064],[9894371.82,537855.52,7.2106485],[9894407.48,537820.47,5.551589],[9894443.15,537785.43,4.7567368],[9894478.81,537750.38,2.5717697],[9894514.47,537715.33,1.5196625],[9894550.13,537680.29,1.5712354],[9894585.8,537645.24,1.6388438],[9892409.77,539853.73,0],[9892445.43,539818.68,0],[9892481.09,539783.63,0],[9892516.75,539748.59,0],[9892552.42,539713.54,0],[9892588.08,539678.5,4.46657],[9892623.74,539643.45,2.8440611],[9892659.4,539608.41,4.667425],[9892695.07,539573.36,4.8930807],[9892730.73,539538.32,5.4140296],[9892766.39,539503.27,7.081043],[9892802.05,539468.23,6.504573],[9892837.72,539433.18,9.199808],[9892873.38,539398.13,7.11094],[9892909.04,539363.09,10.6733],[9892944.7,539328.04,7.646385],[9892980.37,539293,6.5666656],[9893016.03,539257.95,8.613864],[9893051.69,539222.91,9.066914],[9893087.35,539187.86,9.399456],[9893123.02,539152.82,8.650063],[9893158.68,539117.77,8.910679],[9893194.34,539082.73,9.9572935],[9893230,539047.68,13.474816],[9893265.67,539012.63,10.177756],[9893301.33,538977.59,7.9912877],[9893336.99,538942.54,17.392529],[9893372.65,538907.5,24.45648],[9893408.32,538872.45,16.798824],[9893443.98,538837.41,12.826562],[9893479.64,538802.36,12.235101],[9893515.3,538767.32,11.205427],[9893550.97,538732.27,8.8026],[9893586.63,538697.22,8.605091],[9893622.29,538662.18,9.551095],[9893657.95,538627.13,13.3364725],[9893693.62,538592.09,13.705477],[9893729.28,538557.04,12.377354],[9893764.94,538522,14.762568],[9893800.6,538486.95,19.531578],[9893836.27,538451.91,19.14191],[9893871.93,538416.86,16.059696],[9893907.59,538381.82,14.597652],[9893943.25,538346.77,17.347614],[9893978.92,538311.72,14.31054],[9894014.58,538276.68,16.907211],[9894050.24,538241.63,21.347242],[9894085.9,538206.59,24.303734],[9894121.57,538171.54,28.08327],[9894157.23,538136.5,30.69142],[9894192.89,538101.45,34.85525],[9894228.55,538066.41,24.207565],[9894264.22,538031.36,20.033216],[9894299.88,537996.32,20.815453],[9894335.54,537961.27,17.37798],[9894371.2,537926.22,7.896622],[9894406.87,537891.18,8.011894],[9894442.53,537856.13,6.5987387],[9894478.19,537821.09,4.460587],[9894513.85,537786.04,2.141294],[9894549.52,537751,0.5069238],[9894585.18,537715.95,0.5249132],[9894620.84,537680.91,2.1014183],[9894656.5,537645.86,1.0288386],[9892409.15,539924.43,0],[9892444.81,539889.39,0],[9892480.47,539854.34,0],[9892516.14,539819.3,0],[9892551.8,539784.25,1.5499775]],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
      }
    },

    beforeMount: function () {
      this.getListArea();
    },

    methods: {
      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['bg-primary', 'text-light']
        } else {
          return ['bg-light', 'text-info']
        }
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

      createStyleFromIndex(item) {
        let fg_color = item["poly"]["color"];
        if (item.plot === false)
          fg_color = "#696969";

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:150%;";
        return (strstyle);
      },
      eventSelectAreaClicked(idx) {
        let status = !this.table_datas[idx].plot;
        this.table_datas[idx].plot = status; // select/unselect

        this.map_polygon = [];
        for (let i = 0; i < this.table_datas.length; i++) {
          let item = this.table_datas[i];
          if (item.plot === true)
            this.map_polygon.push(item.poly);
        }
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
      openGeobodyPage(item) {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-0",
          // query: {mode:0}
        });
      },
      openXYZPage(item) {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-1",
          query: {mode: 1}
        });
      },

      getTabIcon() {
        return (createTabProcessIconV0(0))
      },
      getTabText() {
        return (createTabProcessTextV0(0))
      },
      wizardButtonClicked(str_router) {
        return (this.varRouter.getRoute(str_router, 1))
      },

      getListArea() {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedArea', {}); //set selected project
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_list]).then();
      },

      createDemoCss(cc) {
        return ('<span class="map-marker3" style="background-color:' + cc + '"/>');
      },
      createCustomMarkerPopup(item) {
        let sstr = 'Area : <b>' + item.area + '</b><br>';
        sstr = sstr + 'Lat : <b>' + item.lat + '</b><br>';
        sstr = sstr + 'Lon : <b>' + item.lon + '</b>';
        return (sstr);
      },
    },
    mounted() {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // // DO
      // this.$nextTick(() => {
      //   this.map = this.$refs.map.mapObject; // work as expected
      // });

      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.table_datas = msg.data; //fill table contents

        this.map_var = createAreaLeafletDemoData();
        for (let i = 0; i < this.table_datas.length; i++) {
          let item = this.table_datas[i];
          this.map_var = fillLeafletAreaVariable(this.map_var, item["coordinate"], i);
          item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
          item.plot = true;

          this.map_polygon.push(item.poly);
        }
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
