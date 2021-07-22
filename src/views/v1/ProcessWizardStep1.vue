<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <splitpanes class="default-theme" vertical style="height: 88vh" vertical>
      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
        <b-tabs v-model="tabIndex">
          <b-tab title="Data by FIELD" :title-link-class="linkClass(0)">Tab contents 1</b-tab>
          <b-tab title="Data by WELL" :title-link-class="linkClass(1)">Tab contents 2</b-tab>
          <b-tab title="Well Files" :title-link-class="linkClass(2)">Tab contents 3</b-tab>
          <b-tab no-body title="Seismic Files" :title-link-class="linkClass(3)">

            <b-row>
              <b-col md="6">
<!--                <ejs-grid :dataSource="table_area" :allowPaging="true" :allowSorting='true'>-->
<!--                  <e-columns>-->
<!--                    <e-column field='id_area' headerText='ID' textAlign='Center' width=40  :customAttributes="areaTableHeaderAttributes"></e-column>-->
<!--                    <e-column field='name' headerText='Area Name' textAlign='Left' :customAttributes="areaTableHeaderAttributes"></e-column>-->
<!--                    <e-column headerText='Discontinued' width='150' textAlign='Center' :template='cTemplate'></e-column>-->
<!--&lt;!&ndash;                    <e-column field='plot' headerText='Plot' width="80"></e-column>&ndash;&gt;-->
<!--                  </e-columns>-->
<!--                </ejs-grid>-->
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
                         :fields="table_area_headers"
                         :items="table_area">

                  <template v-slot:cell(id_color)="row">
                      <span :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)">
                        <i class="fa fa-map"/>
                      </span>
                  </template>
                  <template v-slot:cell(action)="row">
                    <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                    <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                  </template>
                </b-table>
              </b-col>
              <b-col md="6">
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
<!--              <b-col md="4">-->
<!--                <b-table style="height: 30vh"-->
<!--                         show-empty-->
<!--                         sticky-header="53vh"-->
<!--                         :small="true"-->
<!--                         :striped="true"-->
<!--                         :bordered="true"-->
<!--                         :outlined="true"-->
<!--                         :current-page="currentPage"-->
<!--                         :per-page="perPage"-->
<!--                         :filter="filter"-->
<!--                         @filtered="onFiltered"-->
<!--                         :fields="table_headers3"-->
<!--                         :items="tmp_datas">-->

<!--                  <template v-slot:cell(id_color)="row">-->
<!--                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"-->
<!--                            @click="eventSelectAreaClicked(row.index)"/>-->
<!--                  </template>-->
<!--                  <template v-slot:cell(action)="row">-->
<!--                    <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>-->
<!--                    <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>-->
<!--                  </template>-->
<!--                </b-table>-->
<!--              </b-col>-->
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
      </pane>
      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
        <template v-if="showLoader===false">
          <div class="mb-1">
            <ejs-button :cssClass='setMarkerDragStyle()' class="mr-1" v-on:click.native="updateMarkerDragValue()"><i class="fa fa-map-marker"/></ejs-button>
            <ejs-button cssClass='e-outline' class="mr-1" v-on:click.native="httpHeatmapData()"><i class="fa fa-download"/></ejs-button>
            <template v-if="show_marker_drag">
              <span class="ml-5"><b>x</b> : {{marker_drag_coord.lng.toFixed(2)}}   ,    <b>y</b> : {{marker_drag_coord.lat.toFixed(2)}}</span>
            </template>
          </div>

          <l-map ref="map" style="width: 100%; height:96%;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                 @ready="onMapReady">
            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

            <template v-for="(item, idx_poly) in list_area_polygon">
              <l-polygon :lat-lngs="item.polygon" :color="item.color">
                <l-popup :content="item.name"/>
              </l-polygon>
            </template>

            <LHeatmap
              :latLngs="heatmap_data"
              :radius="25"
              :blur="25"
              :minOpacity="0.1"
              :max="heatmap_summary.max" />

            <template v-if="show_marker_drag">
              <l-marker :lat-lng="marker_drag_coord" :draggable="true" :icon="markerDragIcon" @drag="updateMarkerDragCoord">
                <l-popup>X : <b>{{marker_drag_coord.lng.toFixed(2)}}</b><br>Y : <b>{{marker_drag_coord.lat.toFixed(2)}}</b></l-popup>
              </l-marker>
            </template>

          </l-map>
        </template>
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
  import Vue from 'vue';
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  Vue.use(ButtonPlugin);
  import { GridPlugin, Page, Sort } from "@syncfusion/ej2-vue-grids";
  Vue.use(GridPlugin);

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
  import {createAreaDemoData, createAreaLeafletDemoData, createHeatmapDemoData} from "../../libs/demo_data";

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import {addPlotDataToTableArea, getAreaFirstCoordinate} from "../../libs/libUpdateData";
  import {getMapPinMarker} from "../../_constant/http_api";

  import '@geoman-io/leaflet-geoman-free'
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  import "../../libs/leaflet-measure";
  import "../../_assets/leaflet-measure.css";
  import { v4 as uuidv4 } from 'uuid';

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "ProcessWizardStep1",
    provide: {
      grid: [Page, Sort]
    },
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
        cTemplate: function () {
          return { template : Vue.component('columnTemplate',{
              template: `<div v-if=cData class="template_checkbox">
                <input type="checkbox" checked />
            </div>
            <div v-else class="template_checkbox">
                <input type="checkbox" />
            </div>`,
              data: function() {
                return {
                  data: {}
                }
              },
              computed: {
                cData: function() {
                  return this.data.plot;
                }
              }
            })}
        },

        bdemo: false,
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},

        // map variable
        map_var: {},

        // marker drag
        show_marker_drag: false,
        marker_drag_coord: {lat:0, lng:0},
        markerDragIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),

        list_area_polygon: [],
        areaTableHeaderAttributes : {class: 'area_table_header'},
        table_area_headers: createTableAreaListHeader_V1(),
        table_area: [],
        heatmap_data: [],
        heatmap_summary: {min: 0, max:0},

        tabIndex: 3,
        cur_tab: 0,

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers2: createTableAreaListHeader2_V1(),
        table_headers3: createTableAreaListHeader3_V1(),
        table_headers4: createTableAvaHeaderV0(),
        selected_data: {},
        tmp_datas: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_area_list: {success: "successAreaList", fail: "failAreaList"},
        event_http_heatmap_data: {success: "successHeatmapData", fail: "failHeatmapData"},
      }
    },

    beforeMount: function () {
      this.map_var = createAreaLeafletDemoData();
      if(this.bdemo)
      {
        this.table_area = createAreaDemoData();
        this.heatmap_data = createHeatmapDemoData();
        this.list_area_polygon = addPlotDataToTableArea(this.map_var, this.table_area);
        this.marker_drag_coord = getAreaFirstCoordinate(this.table_area);
        this.showLoader = false;
      }
      else
        this.httpListArea();
    },

    methods: {
      mapUpdated (event) {
        // // add listeners on creation and delete on removal
        // if (event.type === 'pm:create') {
        //   event.layer.on('pm:edit', this.mapUpdated);
        //
        //   // add data
        //   event.layer.properties = {
        //     shape: event.shape
        //   };
        //
        //   // radius for circles
        //   if (event.shape === 'Circle') {
        //     event.layer.properties.radius = event.layer.getRadius();
        //   }
        //
        //   event.layer.internalId = uuidv4();
        // }
        // if (event.type === 'pm:remove') {
        //   event.layer.off(); // remove all event listeners
        // }
        //
        // // emit event
        // this.$emit('change', this.getDataAsGeoJSON());
      },
      // export data as GeoJSON object
      getDataAsGeoJSON () {
        // // create FeatureCollection
        // const geoJSON = {
        //   type: 'FeatureCollection',
        //   features: []
        // };
        //
        // // export each layer
        // this.map.eachLayer(function (layer) {
        //   if (layer.internalId && (layer instanceof L.Path || layer instanceof L.Marker)) {
        //     const geoJSONShape = layer.toGeoJSON(16); // to precise geo shape!
        //     geoJSONShape.properties = layer.properties;
        //     geoJSONShape.id = layer.internalId;
        //     geoJSON.features.push(geoJSONShape);
        //
        //     // normalize coordinates (> 180/>90)
        //     // TODO
        //   }
        // });
        //
        // this.geoJsonCoord = geoJSON;
        // return geoJSON;
      },

      // onFinishCreateArea(evt)
      // {
      //   this.area_info = {
      //     area: evt.area,
      //     areaDisplay: evt.areaDisplay,
      //     lastCoord: evt.lastCoord,
      //     length: evt.length,
      //     lengthDisplay: evt.lengthDisplay,
      //     pointCount: evt.pointCount,
      //     points: evt.points
      //   };
      // },
      onMapReady() {
        this.map = this.$refs.map.mapObject;

        const measureControl = new window.L.Control.Measure({
          position: "topleft",
          activeColor: '#FF0000',
          completedColor: '#FF0000',
          primaryLengthUnit: "meters",
          secondaryLengthUnit: "kilometers",
          primaryAreaUnit: "sqmeters",
          secondaryAreaUnit: "hectares"
        });
        this.map.addControl(measureControl);

        this.map.pm.addControls({
          position: 'topleft',
          drawMarker: false,
          drawCircleMarker: false,
          drawPolyline: false,
          drawRectangle: false,
          drawCircle: false
        });
        this.map.pm.setPathOptions({
          color: 'orange',
          fillColor: 'orange',
          fillOpacity: 0.4,
        });

        // listen to events
        this.map.on('pm:create', this.mapUpdated);
        this.map.on('pm:remove', this.mapUpdated);
        this.map.on('pm:cut', this.mapUpdated);
      },

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

      // ------------------------------------------------
      // marker drag
      // ------------------------------------------------
      setMarkerDragStyle()
      {
        if(this.show_marker_drag)
          return("e-warning");
        else
          return("e-outline");
      },
      updateMarkerDragValue()
      {
        this.show_marker_drag = !this.show_marker_drag;
      },
      updateMarkerDragCoord(location)
      {
        this.marker_drag_coord = location.latlng;
      },

      // ------------------------------------------------
      //
      // ------------------------------------------------

      createStyleFromIndex(item) {
        let fg_color = item["poly"]["color"];
        if (item.plot === false)
          fg_color = "#696969";

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventSelectAreaClicked(idx) {
        let status = !this.table_area[idx].plot;
        this.table_area[idx].plot = status; // select/unselect

        this.list_area_polygon = [];
        for (let i = 0; i < this.table_area.length; i++) {
          let item = this.table_area[i];
          if (item.plot === true)
            this.list_area_polygon.push(item.poly);
        }
      },
      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_area.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_area.length);
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

      httpListArea() {
        this.showLoader = true;
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_area_list]).then();
      },
      httpHeatmapData() {
        this.showLoader = true;
        let param = {
          "state": 0,
          "type": "/api/heatmap/get",
          "mesg": "",
          "data": {
            "id_area": 2,
            "file_loc": "TUNU95/08_heatmap",
            "feature": "sum",
            "file_name": "heatmap_TUNU95_v30_cal_prob_0500_0600.csv"
          }
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("demo-heatmap"), param, this.event_http_heatmap_data]).then();
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

      // DO
      this.$nextTick(() => {
      //   this.map = this.$refs.map.mapObject; // work as expected
      });

      //-----------------------------------------------------------------
      // LIST AREA
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_area_list.success, (msg) => {
        this.table_area = msg.data; //fill table contents

        this.map_var = createAreaLeafletDemoData();
        this.list_area_polygon = addPlotDataToTableArea(this.map_var, this.table_area);
        this.marker_drag_coord = getAreaFirstCoordinate(this.table_area);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_area_list.fail, (msg) => {
        this.showLoader = false;
        this.table_area = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // HEATMAP DATA
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_heatmap_data.success, (msg) => {
        this.heatmap_data = msg.data["heatmap"]; //fill table contents
        this.heatmap_summary = msg.data["sum"];
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_heatmap_data.fail, (msg) => {
        this.showLoader = false;
        this.heatmap_data = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_area_list.success);
      EventBus.$off(this.event_http_area_list.fail);
      EventBus.$off(this.event_http_heatmap_data.success);
      EventBus.$off(this.event_http_heatmap_data.fail);
      this.showLoader = false;
    },
  }
</script>

<style>
  .e-grid .e-headercell.area_table_header{
    background-color: #6495ED;
    color: white;
  }
</style>
