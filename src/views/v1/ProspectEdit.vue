<template>
<div>
  <splitpanes class="default-theme" vertical style="height: 87vh" vertical>
    <pane class="p-2" min-size="20" max-size="40" style="background: white">
      <!--            <b-card-header header-tag="header" class="p-0" role="tab">Layer List</b-card-header>-->
      <!--            <b-card-body>-->
      <b-table
        sticky-header="85vh"
        show-empty
        :small="true"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :fields="table_prospect_map_heder"
        :items="table_prospect_map">
<!--        <template v-slot:cell(show)="row">-->
<!--                  <span @click="eventSwitchLayerClicked(row.index, row.item)"-->
<!--                        :style="eventSelectedLayerCssStyle(row.item)">-->
<!--                    <template v-if="row.item.show">-->
<!--                      <i class="btn_toolbar fa fa-toggle-on"/>-->
<!--                    </template>-->
<!--                    <template v-else>-->
<!--                      <i class="btn_toolbar fa fa-toggle-off"/>-->
<!--                    </template>-->
<!--                  </span>-->
<!--        </template>-->
      </b-table>
<!--      <div>-->
<!--        <span class="mr-5">NPoint : <b>{{prospectScore.score.np}}</b></span>-->
<!--        <span class="mr-5">Score : <b>{{prospectScore.score.score.toFixed(3)}}</b></span>-->
<!--        <span>Area : <b>{{prospectScore.score.area.toFixed(3)}}</b></span>-->
<!--      </div>-->
<!--      <div class="mt-2">-->
<!--        <ejs-button cssClass='e-danger' class="mr-2 mb-2" v-on:click.native='onClickComputeScore'>Compute Score-->
<!--        </ejs-button>-->
<!--        <ejs-button cssClass='e-success' class="mr-2 mb-2">Save</ejs-button>-->
<!--      </div>-->
      <!--            </b-card-body>-->
    </pane>
    <pane class="p-2" min-size="40" max-size="80" style="background: white">

      <template v-if="showMapProspect">
        <div class="mb-1">
          <!-- map button -->
          <ejs-button :cssClass='markerLocationCssStyle()' class="mr-1"
                      v-on:click.native="markerLocationEventClick()"><i
            class="fa fa-map-marker"/></ejs-button>
        </div>
        <l-map ref="map" style="width: 100%; height:82vh;" :zoom="map_var.zoom" :center="map_var.center"
               :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
               @ready="onMapReady" @click="onMapClickEvent">
          <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>
<!--          <template v-if="show_marker_drag">-->
<!--            <l-marker :lat-lng="pageParam" :draggable="false" :icon="markerDragIcon">-->
<!--              <l-popup>-->
<!--                <div style="width: 100%">-->
<!--                  Lat (x) : <b>{{pageParam.lng.toFixed(2)}}</b><br>-->
<!--                  Lon (y) : <b>{{pageParam.lat.toFixed(2)}}</b><br>-->
<!--                </div>-->
<!--              </l-popup>-->
<!--            </l-marker>-->
<!--          </template>-->

          <!--              <template v-for="item in tmp_array_autoupdate">-->
          <!--              </template>-->

          <template v-for="layer in table_prospect_map">
            <template v-if="layer.show===true">
              <LHeatmap
                :latLngs="layer.heatmap"
                :radius="15"
                :blur="15"
                :minOpacity="0.1"
                :max="1.0">
              </LHeatmap>
            </template>
          </template>
        </l-map>
      </template>
    </pane>
  </splitpanes>

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
</div>
</template>

<script>
  import Vue from 'vue';
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';

  Vue.use(ButtonPlugin);

  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {createProspectEditDemoData, createProspectMapData, getSectionData} from "../../libs/data";
  import LChartSeismicAreaSelected from "../components/LChartSeismicAreaSelected";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'

  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import DynamicInputForMap from "../myview/DynamicInputForMap";
  import {appDemoMode, getMapPinMarker} from "../../_constant/http_api";
  import {rotate} from "../../libs/2d-array-rotation";
  import {addPlotDataToProspectMap, createDefaultSectionAreaParameter} from "../../libs/libUpdateData";
  import {
    addShowKeyToLayer,
    createAreaLeafletDemoData,
    createDemoProposeProspect,
    createHeatmapDemoData
  } from "../../libs/demo_data";
  import ProposeProspectInfo from "../myview/ProposeProspectInfo";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'

  import VueLeafletMap from "../components/vue-leaflet-map"
  import LHeatmap from "../components/Vue2LeafletHeatmap";
  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import '@geoman-io/leaflet-geoman-free'
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  import "../../libs/leaflet-measure";
  import "../../_assets/leaflet-measure.css";
  import {v4 as uuidv4} from 'uuid';
  import * as turf from "@turf/turf";
  import {createTableProspectMapHeader} from "../../libs/libVars";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

    export default {
        name: "ProspectEdit",

      components: {
        ProposeProspectInfo,
        DynamicInputForMap,
        LChartSeismicAreaSelected,
        EnhancedCheck,
        bFormSlider,
        VueSimpleDialog,

        Splitpanes, Pane,

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

      data: () => {
        return {
          bdemo: appDemoMode(),
          retStatus: {status: 0, title: "", message: "", data: []},
          showLoader: false,
          showMapProspect: false,

          // map variable
          map_var: {},
          prospectScore: {score: {np: 0, score: 0, area: 0}},
          geo_json: {},

          tabIndex: 0,
          pageParam: {
            id_area: -1,
            filename: "",
          },
          markerDragIcon: L.icon({
            iconUrl: getMapPinMarker(),
            iconSize: [32, 36],
            iconAnchor: [16, 36]
          }),
          show_marker_drag: true,
          refreshChart: false,
          proposeProspect: {},
          prospectMap: {ndata: 0, layers: []},

          paramInput: createDefaultSectionAreaParameter(),
          datas: [],
          seismics: [],
          boundaryX: [
            {
              p1: 0,
              p2: 0,
            },
            {
              p1: 0,
              p2: 0,
            }
          ],
          boundaryY: {
            p1: 0,
            p2: 0,
          },
          colormap: {id: 3, reverse: false},
          perc: 0,
          reverseColormap: false,
          cmin: 20,
          cmax: 20,
          tmp_cmin: 20,
          tmp_cmax: 20,
          tmp_array_autoupdate: [],

          table_prospect_map_heder: createTableProspectMapHeader(),
          table_prospect_map: [],
          event_http_get_section: {success: "successGetSection", fail: "failGetSection"},
          event_http_propose_prospect: {success: "successProposeProspect", fail: "failProposeProspect"},
          event_http_prospect_map: {success: "successProspectMap", fail: "failProspectMap"},
          event_http_prospect_score: {success: "successProspectScore", fail: "failProspectScore"},
        }
      },
      created() {
        this.$store.dispatch('createVarRouter').then(); //no selected project
      },

      beforeMount: function () {
        this.map_var = createAreaLeafletDemoData();
        this.pageParam["id_area"] = this.$route.query.id_area * 1;
        this.pageParam["filename"] = this.$route.query.filename;
        if (this.bdemo) {
          // this.fillDataVariable(getSectionData());
          this.proposeProspect = createProspectEditDemoData();
          // this.prospectMap = createProspectMapData();
          // this.table_prospect_map = addPlotDataToProspectEdit(this.map_var, this.prospectMap);

          this.tabIndex = 1;
          this.showLoader = false;
          this.showMapProspect = true;
        } else
          this.httpGetSection();
      },

      methods: {
        onMapReady() {
          this.map = this.$refs.map.mapObject;

          // const measureControl = new window.L.Control.Measure({
          //   position: "topleft",
          //   activeColor: '#FF0000',
          //   completedColor: '#FF0000',
          //   primaryLengthUnit: "meters",
          //   secondaryLengthUnit: "kilometers",
          //   primaryAreaUnit: "sqmeters",
          //   secondaryAreaUnit: "hectares"
          // });
          // this.map.addControl(measureControl);

          this.map.pm.addControls({
            position: 'topleft',
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawCircle: false,
            cutPolygon: false
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
        onMapClickEvent(event) {
          // if (this.show_marker_drag)
          //   this.marker_drag_coord = event.latlng;
        },

        markerLocationCssStyle() {
          if (this.show_marker_drag)
            return ("e-warning");
          else
            return ("e-outline");
        },
        markerLocationEventClick() {
          this.show_marker_drag = !this.show_marker_drag;
        },

        createDefaultBoundaryParameter() {
          let tstart = 0;
          let tend = 0;
          let ns, ntrc, dt;
          for (let i = 0; i < this.datas.length; i++) {
            ns = this.seismics[i]["ns"];
            ntrc = this.seismics[i]["ntrace"];
            dt = this.seismics[i]["y"]["sampling"];
            let tmpx1 = Math.floor(this.seismics[i]["idx_st"] + Math.round(ntrc / 2));
            let tmpx2 = Math.floor(this.seismics[i]["idx_en"] - Math.round(ntrc / 2));

            tstart = this.seismics[i]["y"]["start"] * dt;
            tend = (this.seismics[i]["ns"] - this.seismics[i]["y"]["start"]) * dt;
            this.paramInput[i]["min"] = this.seismics[i]["idx_st"];
            this.paramInput[i]["max"] = this.seismics[i]["idx_en"];
            this.paramInput[i]["vmin"] = tmpx1;
            this.paramInput[i]["vmax"] = tmpx2;


            this.boundaryX[i]["p1"] = tmpx1;
            this.boundaryX[i]["p2"] = tmpx2;
          }
          let tmpy1 = Math.floor(tstart + Math.round(ns * dt / 3));
          let tmpy2 = Math.floor(tend - Math.round(ns * dt / 3));
          this.paramInput[2]["min"] = tstart;
          this.paramInput[2]["max"] = tend;
          this.paramInput[2]["vmin"] = tmpy1;
          this.paramInput[2]["vmax"] = tmpy2;
          this.boundaryY["p1"] = tmpy1;
          this.boundaryY["p2"] = tmpy2;
        },
        fillDataVariable(tmp) {
          this.datas = tmp;
          this.seismics = this.datas;
          for (let i = 0; i < this.datas.length; i++) {
            this.seismics[i]["cdp_data"] = rotate(this.datas[i]["cdp_data"], -90);
            this.seismics[i]["x"]["data"] = this.seismics[i]["cdp_header"];
          }
          this.createDefaultBoundaryParameter();
        }
      },

      mounted() {
        setTimeout(function () {
          window.dispatchEvent(new Event('resize'))
        }, 250);

        // DO
        this.$nextTick(() => {
          //   this.map = this.$refs.map.mapObject; // work as expected
        });
      },
    }
</script>

<style scoped>

</style>
