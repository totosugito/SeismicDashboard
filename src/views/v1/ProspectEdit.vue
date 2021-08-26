<template>
<div>
  <vue-element-loading
    :spinner="spinLoader.spinner"
    :color="spinLoader.color"
    :background-color="spinLoader.background_color"
    :size="spinLoader.size"
    :active="showLoader"/>

  <splitpanes class="default-theme" vertical style="height: 87vh" vertical>
    <pane class="p-2" min-size="20" max-size="40" style="background: white">
      <!--            <b-card-header header-tag="header" class="p-0" role="tab">Layer List</b-card-header>-->
      <!--            <b-card-body>-->
      <b-table
        responsive
        sticky-header="75vh"
        show-empty
        :small="true"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :fields="table_prospect_map_heder"
        :items="table_prospect_map">
        <template v-slot:cell(show)="row">
                  <span @click="eventSwitchLayerClicked(row.index, row.item)"
                        :style="eventSelectedLayerCssStyle(row.item)">
                    <template v-if="row.item.show">
                      <i class="btn_toolbar fa fa-toggle-on"/>
                    </template>
                    <template v-else>
                      <i class="btn_toolbar fa fa-toggle-off"/>
                    </template>
                  </span>
        </template>
      </b-table>
      <div>
        <span class="mr-5">NPoint : <b>{{prospectScore.score.np}}</b></span>
        <span class="mr-5">Score : <b>{{prospectScore.score.score.toFixed(3)}}</b></span>
        <span>Area : <b>{{prospectScore.score.area.toFixed(3)}}</b></span>
      </div>
      <div class="mt-2">
        <ejs-button cssClass='e-danger' class="mr-2 mb-2" v-on:click.native='onClickComputeScore'>Compute Score
        </ejs-button>
        <ejs-button cssClass='e-success' class="mr-2 mb-2" v-on:click.native='onClickSaveProject'>Save</ejs-button>
      </div>
      <!--            </b-card-body>-->
    </pane>
    <pane class="p-2" min-size="40" max-size="80" style="background: white">

      <template v-if="showMapProspect">
<!--        <div class="mb-1">-->
<!--          &lt;!&ndash; map button &ndash;&gt;-->
<!--          <ejs-button :cssClass='markerLocationCssStyle()' class="mr-1"-->
<!--                      v-on:click.native="markerLocationEventClick()"><i-->
<!--            class="fa fa-map-marker"/></ejs-button>-->
<!--        </div>-->
        <l-map ref="map" style="width: 100%; height:85vh;" :zoom="map_var.zoom" :center="map_var.center"
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
                :max="prospectMap.v_min_max.max">
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
  import { forEach } from 'lodash';
  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import DynamicInputForMap from "../myview/DynamicInputForMap";
  import {appDemoMode, getMapPinMarker} from "../../_constant/http_api";
  import {rotate} from "../../libs/2d-array-rotation";
  import {
    addPlotDataToProspectEdit,
    addPlotDataToProspectMap,
    createDefaultSectionAreaParameter, fillLeafletProspectMapVariable
  } from "../../libs/libUpdateData";
  import {
    addShowKeyToLayer,
    createAreaLeafletDemoData,
    createDemoProposeProspect,
    createHeatmapDemoData, getSampleGeoJson
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
  import {readProspectData} from "../../_constant/active_user";

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
            id: "",
          },
          objParam: {},
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
        this.map_var.zoom = 14;

        this.pageParam["id"] = this.$route.query.id;
        this.objParam = readProspectData(this.pageParam["id"]);
        this.proposeProspect = this.objParam["dmp"];

        // console.log(JSON.stringify(this.proposeProspect))
        let tmp_geojson = getSampleGeoJson();
        tmp_geojson[0]["geometry"]["coordinates"] = [this.proposeProspect["polygon"]]

        this.proposeProspect["geojson"] = tmp_geojson;
        this.geo_json = this.proposeProspect["geojson"];
        // console.log(JSON.stringify(this.geo_json))

        this.map_var = fillLeafletProspectMapVariable(this.map_var, this.proposeProspect, 0);

        if (this.bdemo) {
          this.prospectMap = createProspectEditDemoData();
          this.table_prospect_map = addPlotDataToProspectEdit(this.prospectMap);

          this.tabIndex = 1;
          this.showLoader = false;
          this.showMapProspect = true;
        } else
          this.httpGetProspectData();
      },

      methods: {
        eventSelectedLayerCssStyle(item) {
          let fg_color = "#808080";
          if (item.show)
            fg_color = "#4169E1";
          let strstyle =
            "color:" + fg_color + "; " +
            "font-size:100%;";
          return (strstyle);
        },
        eventSwitchLayerClicked(index, item) {
          let status = !item.show;
          item.show = status;
          // this.prospectMap.layers[index].show = status;

          // this.tmp_array_autoupdate = [];
          // console.log(JSON.stringify(this.prospectMap.layers[index]))
        },
        convertLayerToLeafletPopup(layer) {
          let geo_json = layer.toGeoJSON(16);
          let geom_type = geo_json["geometry"]["type"];
          let geom_polygon = geo_json["geometry"]["coordinates"];
          let polygon = turf.polygon(geom_polygon);
          let area = turf.area(polygon);
          let line = turf.lineString(geom_polygon[0]);
          let length_meters = turf.length(line, {units: 'meters'});
          let length_miles = turf.length(line, {units: 'miles'});

          let html_string = `Type : <b>${geom_type}</b><br>`;
          html_string = html_string + `Point : <b>${geom_polygon[0].length}</b><br>`;
          html_string = html_string + `Area : <br>`;
          html_string = html_string + `<b>${(area).toLocaleString()}</b> m<sup>2</sup><br>`;
          html_string = html_string + `<b>${(area / (1e+4)).toLocaleString()}</b> ha<br>`;
          html_string = html_string + `Length : <br>`;
          html_string = html_string + `<b>${(length_meters).toLocaleString()}</b> meters<br>`;
          html_string = html_string + `<b>${(length_miles).toLocaleString()}</b> miles<br>`;
          return (html_string);
        },
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

          // this.createLayersFromJson();
          // function to check if it is a Rectangle
          var onEachFeature = (feature, layer) => {
            if (feature.properties.shape === 'Rectangle')
            {
              // we need to create a new Rectangle Layer and add it to an array
              addList.push(L.rectangle(layer.getBounds()));
              // we add the current layer to the remove list
              removeList.push(layer)
            }
          };
          L.geoJSON(this.proposeProspect["geojson"], {
            onEachFeature,
            style: {
              color: 'orange',
              fillColor: 'orange',
              fillOpacity: 0.4,
            }
          }).addTo(this.map);
        },

        onMapClickEvent(event) {
          // if (this.show_marker_drag)
          //   this.marker_drag_coord = event.latlng;
        },
        mapUpdated(event) {
          // add listeners on creation and delete on removal
          if (event.type === 'pm:create') {
            event.layer.on('pm:edit', this.mapUpdated);

            // add data
            event.layer.properties = {
              shape: event.shape
            };

            // radius for circles
            if (event.shape === 'Circle') {
              event.layer.properties.radius = event.layer.getRadius();
            }

            event.layer.internalId = uuidv4();
            this.geo_json = event.layer.toGeoJSON(16);
            console.log(JSON.stringify(this.geo_json))

            event.layer.bindPopup(this.convertLayerToLeafletPopup(event.layer));
            // console.log("create")
          } else if (event.type === 'pm:edit') {
            // console.log("edit")
            event.layer.bindPopup(this.convertLayerToLeafletPopup(event.layer));
            this.geo_json = event.layer.toGeoJSON(16);
            console.log(JSON.stringify(this.geo_json))
          } else if (event.type === 'pm:remove') {
            event.layer.off(); // remove all event listeners
          }

          let geo_json_data = this.getDataAsGeoJSON();
          // for (let i = 0; i < geo_json_data.features.length; i++) {
          //   let item = geo_json_data.features[i];
          //   let polygon = turf.polygon(item.geometry.coordinates);
          //   let area = turf.area(polygon);
          //   geo_json_data.features.area = area;
          // }
          // console.log(JSON.stringify(geo_json_data));

          // emit event
          this.$emit('change', geo_json_data);
        },
        // export data as GeoJSON object
        getDataAsGeoJSON() {
          // create FeatureCollection
          const geoJSON = {
            type: 'FeatureCollection',
            features: []
          };

          // export each layer
          this.map.eachLayer(function (layer) {
            if (layer.internalId && (layer instanceof L.Path || layer instanceof L.Marker)) {
              const geoJSONShape = layer.toGeoJSON(16); // to precise geo shape!
              geoJSONShape.properties = layer.properties;
              geoJSONShape.id = layer.internalId;
              geoJSON.features.push(geoJSONShape);

              // normalize coordinates (> 180/>90)
              // TODO
            }
          });

          this.geoJsonCoord = geoJSON;
          return geoJSON;
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
        },

        onClickComputeScore() {
          let param = {
            data: this.proposeProspect
          };
          // console.log(JSON.stringify(param))
          param["data"]["polygon"] = this.geo_json[0]["geometry"]["coordinates"][0];
          // console.log(JSON.stringify(param))
          this.showLoader = true;
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("potprosp-score"), param, this.event_http_prospect_score]).then();
        },
        onClickSaveProject()
        {
          let param = {
            data: this.proposeProspect
          };
          param["data"]["polygon"] = this.geo_json;
          console.log(JSON.stringify(param));
        },

        httpGetProspectData()
        {
          let param = {
            data: {
              id_area: this.objParam["id_area"],
              filename: this.objParam["filename"]
            }
          }

          this.showLoader = true;
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-data"), param, this.event_http_prospect_map]).then();
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

        EventBus.$on(this.event_http_prospect_score.success, (msg) => {
          this.prospectScore = msg.data;
          this.showLoader = false;
        });
        EventBus.$on(this.event_http_prospect_score.fail, (msg) => {
          this.showLoader = false;
          this.prospectScore = {score: {np: 0, score: 0}};
          this.retStatus = msg;
          this.$refs.dialogMessage.showModal();
        });

        EventBus.$on(this.event_http_prospect_map.success, (msg) => {
          this.prospectMap = msg.data;
          this.table_prospect_map = addPlotDataToProspectEdit(this.prospectMap);

          this.showLoader = false;
          this.showMapProspect = true;
        });
        EventBus.$on(this.event_http_prospect_map.fail, (msg) => {
          this.showLoader = false;
          this.prospectMap = {};
          this.table_prospect_map = [];
          this.retStatus = msg;
          this.$refs.dialogMessage.showModal();
        });
      },
      beforeDestroy() {
        EventBus.$off(this.event_http_prospect_score.success);
        EventBus.$off(this.event_http_prospect_score.fail);
        EventBus.$off(this.event_http_prospect_map.success);
        EventBus.$off(this.event_http_prospect_map.fail);

      },
    }
</script>

<style scoped>

</style>
