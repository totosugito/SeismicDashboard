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
        <div>
          <ejs-button cssClass='e-light' class="mr-2 mb-2" v-on:click.native='onUncheckAll'><i class="fa fa-square-o"/>
            Uncheck All
          </ejs-button>
        </div>
        <b-table
          responsive
          sticky-header="50vh"
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
          <div class="mb-2">CONFIDENCE RATING</div>
          <StarRating v-model="proposeProspect.score.star" :rating="proposeProspect.score.star" :star-size="30"
                      :show-rating="false" :maxRating="10" activeColor="#FF8C00"/>
        </div>
        <div>
          <div class="mb-2 mt-3">NOTE</div>
          <b-form-textarea
            v-model="proposeProspect.score.note"
            placeholder="Enter something..."
            rows="3"
            max-rows="6"/>
        </div>
        <div>
          <span class="mr-5">NPoint : <b>{{proposeProspect.score.np}}</b></span>
          <span class="mr-5">Score : <b>{{proposeProspect.score.score.toFixed(3)}}</b></span>
          <span>Area : <b>{{proposeProspect.score.area.toFixed(3)}}</b></span>
        </div>
        <div class="mt-2">
          <ejs-button cssClass='e-success' class="mr-2 mb-2" v-on:click.native='onClickSaveProject'>Update</ejs-button>
          <ejs-button cssClass='e-info' class="mr-2 mb-2" v-on:click.native='onClickViewGather'>View Gather</ejs-button>
        </div>
      </pane>
      <pane class="p-2" min-size="40" max-size="80" style="background: white">
        <template v-if="showMapProspect">
          <div class="mb-1">
            <ejs-button :cssClass='setToggleButtonStyle(show_marker_center)' class="mr-1"
                        v-on:click.native="markerCenterLocationEventClick()" v-b-tooltip.hover
                        title="Prospect center location"><i
              class="fa fa-street-view"/></ejs-button>
            <ejs-button :cssClass='setToggleButtonStyle(show_marker_drag)' class="mr-1"
                        v-on:click.native="markerLocationEventClick()" v-b-tooltip.hover title="Map marker position"><i
              class="fa fa-map-marker"/></ejs-button>

            <ejs-button cssClass='e-outline' class="ml-3 mr-1" v-on:click.native="downloadSelectedWell()">
              <i class="fa fa-podcast" v-b-tooltip.hover title="Download well"/>
            </ejs-button>
            <ejs-button :cssClass='markerWellCssStyle()' class="mr-1"
                        v-on:click.native="markerWellEventClick()"><i
              class="fa fa-deviantart" v-b-tooltip.hover title="Show or hide well"/></ejs-button>

            <template v-if="show_marker_drag">
              <span class="ml-5"><b>x</b> : {{marker_drag_coord.lat.toFixed(2)}}   ,    <b>y</b> : {{marker_drag_coord.lng.toFixed(2)}}</span>
            </template>
          </div>
          <l-map ref="map" style="width: 100%; height:82vh;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                 @ready="onMapReady" @click="onMapClickEvent">

            <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>
            <l-control position="topright" style="margin-top: 30px">
                <div class="options">
                  <label>Radius ({{heatmapScale.radius.value}})</label><br/>
                  <b-form-input style="width: 150px" v-model="heatmapScale.radius.value" type="range" :min="heatmapScale.radius.min" :max="heatmapScale.radius.max"></b-form-input>
                  <label>Blur ({{heatmapScale.blur.value}})</label><br/>
                  <b-form-input style="width: 150px" v-model="heatmapScale.blur.value" type="range" :min="heatmapScale.blur.min" :max="heatmapScale.blur.max"></b-form-input>
                </div>
            </l-control>
            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

            <template v-if="show_marker_center">
              <l-marker :lat-lng="{lat: proposeProspect.marker.lng, lng: proposeProspect.marker.lat}" :draggable="false"
                        :icon="markerCenterIcon">
                <l-popup>
                  <div style="width: 100%">
                    Lat (x) : <b>{{proposeProspect.marker.lat.toFixed(2)}}</b><br>
                    Lon (y) : <b>{{proposeProspect.marker.lng.toFixed(2)}}</b><br>
                    Area : <b>{{proposeProspect.marker.area}}</b><br>
                    Layer : <b>{{proposeProspect.marker.layer}}</b><br>
                    <b>{{proposeProspect.marker.label}}</b>
                  </div>
                </l-popup>
              </l-marker>
            </template>
            <template v-if="show_marker_drag">
              <l-marker :lat-lng="{lat: marker_drag_coord.lng, lng: marker_drag_coord.lat}" :draggable="false" :icon="markerDragIcon">
                <l-popup :options="{className: 'customPopup'}" >
                  <div style="width: 100%">
                    Lat (x) : <b>{{marker_drag_coord.lat.toFixed(2)}}</b><br>
                    Lon (y) : <b>{{marker_drag_coord.lng.toFixed(2)}}</b><br>

                    <template v-if="isValidGatherDataFromMarker()">
                      Iline : <b>{{marker_drag_coord.gather.iline}}</b><br>
                      Xline : <b>{{marker_drag_coord.gather.xline}}</b><br>
                      <b-input-group prepend="Z Min" size="sm">
                        <b-form-input v-model="marker_drag_coord.gather.z.min"/>
                      </b-input-group>
                      <b-input-group prepend="Z Max" size="sm">
                        <b-form-input v-model="marker_drag_coord.gather.z.max"/>
                      </b-input-group>

                      <b-button class="btn btn-sm mt-2 mr-2" variant="success" @click="httpOpenGatherFromMapMarker()">Open
                        Gather
                      </b-button>
<!--                    <b-button class="btn btn-sm mt-2" variant="warning" @click="editOpenGatherDialogShow()">Edit-->
<!--                    </b-button>-->
                    </template>
                    <template v-else>
                      <b-button class="btn btn-sm mt-2" variant="primary" @click="httpFindGatherFromMapMarker()">Find
                        Gather
                      </b-button>
                    </template>
                  </div>
                </l-popup>
              </l-marker>
            </template>

            <template v-for="layer in table_prospect_map">
              <template v-if="layer.show===true">
                <LHeatmap
                  :latLngs="layer.heatmap"
                  :radius="heatmapScale.radius.value*1"
                  :blur="heatmapScale.blur.value*1"
                  :minOpacity="0.1"
                  :max="heatmap_range[layer.cmap].max">
                </LHeatmap>
              </template>
            </template>

            <template v-if="show_well_marker">
              <template v-for="wellmarker in well_marker">
                <l-polyline :lat-lngs="wellmarker.data" color="red" :weight="2">
                  <l-tooltip :options="{permanent: 'true', opacity: 0.6, className: 'my-labels'}">{{wellmarker.name}}</l-tooltip>
                </l-polyline>
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

    <!-- edit find gather parameter -->
<!--    <vue-form-dialog-->
<!--      ref="editOpenGathertDialog"-->
<!--      type="default"-->
<!--      header="Edit Parameter" body="Body"-->
<!--      btn1_text="Close" btn2_text="Save"-->
<!--      btn1_style="danger" btn2_style="primary"-->
<!--      @btn1Click="editOpenGatherDialogBtn1Click()" @btn2Click="editOpenGatherDialogBtn2Click()">-->

<!--      &lt;!&ndash; body slot &ndash;&gt;-->
<!--      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">-->
<!--              <vue-form-generator :schema="edit_open_gather_schema" :model="edit_open_gather_model" :options="formOptions" @validated="onValidated"/>-->
<!--            </span>-->
<!--    </vue-form-dialog>-->
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
  import StarRating from 'MyLibVue/src/views/star-rating/star-rating'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  import {forEach} from 'lodash';
  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  // import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  // import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import DynamicInputForMap from "../myview/DynamicInputForMap";
  import {appDemoMode, getMapPinMarker, getWellPinMarker} from "../../_constant/http_api";
  import {rotate} from "../../libs/2d-array-rotation";
  import {
    addPlotDataToProspectEdit, addPlotDataToProspectEditMultiData,
    addPlotDataToProspectMap,
    createDefaultSectionAreaParameter, fillLeafletProspectMapVariable, uncheckAllData
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
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip, LControlScale, LControl, LPolyline} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import '@geoman-io/leaflet-geoman-free'
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  import "../../libs/leaflet-measure";
  import "../../_assets/leaflet-measure.css";
  import {v4 as uuidv4} from 'uuid';
  import * as turf from "@turf/turf";
  import {createEditOpenGatherSchema, createTableProspectMapHeader} from "../../libs/libVars";
  import {readProspectData, saveProspectData} from "../../_constant/active_user";

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
      StarRating,

      Splitpanes, Pane,

      // VueFormDialog,
      // "vue-form-generator": VueFormGenerator.component,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip,
      LHeatmap,
      LControlScale,
      LControl,
      LPolyline
    },

    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),

    data: () => {
      return {
        bvalidate: false,
        bdemo: appDemoMode(),
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: false,
        showMapProspect: false,

        show_well_marker: false,
        well_marker: [],

        heatmapScale :{
          radius: {
            min: 5,
            max: 50,
            value: 15
          },
          blur: {
            min: 5,
            max: 50,
            value: 15
          }
        },
        // map variable
        map_var: {},
        prospectScore: {score: {np: 0, score: 0, area: 0}},
        geo_json: {},

        tabIndex: 0,
        pageParam: {
          id: "",
        },
        objParam: {},
        markerCenterIcon: L.icon({
          iconUrl: getWellPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),
        markerDragIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),
        show_geo_json: true,

        show_marker_center: true,
        show_marker_drag: false,
        marker_drag_coord: {lat: 0, lng: 0, gather: {z: {min: 0, max:0}}},
        refreshChart: false,
        proposeProspect: {},
        prospectMap: {ndata: 0, layers: []},
        heatmap_range: [],

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

        edit_open_gather_schema: createEditOpenGatherSchema(),
        edit_open_gather_model: {},
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_get_section: {success: "successGetSection", fail: "failGetSection"},
        event_http_propose_prospect: {success: "successProposeProspect", fail: "failProposeProspect"},
        event_http_prospect_map: {success: "successProspectMap", fail: "failProspectMap"},
        event_http_prospect_score: {success: "successProspectScore", fail: "failProspectScore"},
        event_http_save_prospect: {success: "successSaveProspect", fail: "failSaveProspect"},
        event_http_find_gather_from_latlng: {success: "successFindGatherFromLatLng", fail: "failFindGatherFromLatLng"},
        event_http_well_download: {success: "successWellDownload", fail: "failWellDownload"},
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
      this.geo_json = this.proposeProspect["geojson"];
      this.marker_drag_coord = {
        lat: this.proposeProspect["marker"].lat,
        lng: this.proposeProspect["marker"].lng,
        gather: {z: {min:0, max:0}}
      };
      this.map_var = fillLeafletProspectMapVariable(this.map_var, this.proposeProspect, 0);

      if (this.bdemo) {
        this.prospectMap = createProspectEditDemoData();
        this.table_prospect_map = addPlotDataToProspectEditMultiData(this.prospectMap);
        this.heatmap_range = this.prospectMap.v_min_max;

        this.tabIndex = 1;
        this.showLoader = false;
        this.showMapProspect = true;
      } else {
        this.httpGetProspectData();
      }
    },

    methods: {
      // onValidated(isValid, errors) {
      //   this.bvalidate = isValid;
      // },
      // editOpenGatherDialogShow()
      // {
      //   // this.edit_open_gather_model = {
      //   //   zmin: this.marker_drag_coord["gather"]["z"]["min"],
      //   //   zmax: this.marker_drag_coord["gather"]["z"]["max"],
      //   // };
      //   this.edit_open_gather_model = {
      //     zmin: 100,
      //     zmax: 200
      //   }
      //   this.$refs.editOpenGathertDialog.showModal();
      // },
      //
      // editOpenGatherDialogBtn1Click() {
      //   this.$refs.editOpenGathertDialog.hideModal();
      // },
      // editOpenGatherDialogBtn2Click() {
      //   if (!this.bvalidate) return;
      //
      //   this.marker_drag_coord["gather"]["z"]["min"] = this.edit_open_gather_model["zmin"];
      //   this.marker_drag_coord["gather"]["z"]["max"] = this.edit_open_gather_model["zmax"];
      //   this.$refs.editOpenGathertDialog.hideModal();
      // },

      isValidGatherDataFromMarker() {
        if (!("gather" in this.marker_drag_coord))
          return (false);

        if (!("iline" in this.marker_drag_coord["gather"]))
          return (false);

        return (true);
      },
      dialogMessageBtn1Click() {
        this.$refs.dialogMessage.hideModal();
      },
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
          if (feature.properties.shape === 'Rectangle') {
            // we need to create a new Rectangle Layer and add it to an array
            addList.push(L.rectangle(layer.getBounds()));
            // we add the current layer to the remove list
            removeList.push(layer)
          }
        };
        L.geoJSON(this.proposeProspect["geojson"], {
          onEachFeature,
          style: {
            color: '#FFA500',
            fillColor: 'orange',
            weight: 1,
            fillOpacity: 0.2,
          }
        }).addTo(this.map);
      },

      onMapClickEvent(event) {
        if (this.show_marker_drag) {
          this.marker_drag_coord = {lat: event.latlng.lng, lng: event.latlng.lat};
          //TODO CEK INI
          this.marker_drag_coord.gather = {};
        }
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
          // console.log(JSON.stringify(this.geo_json))

          event.layer.bindPopup(this.convertLayerToLeafletPopup(event.layer));
          // console.log("create")
        } else if (event.type === 'pm:edit') {
          // console.log("edit")
          event.layer.bindPopup(this.convertLayerToLeafletPopup(event.layer));
          this.geo_json = event.layer.toGeoJSON(16);
          // console.log(JSON.stringify(this.geo_json))
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

      setToggleButtonStyle(status) {
        if (status)
          return ("e-warning");
        else
          return ("e-outline");
      },
      markerCenterLocationEventClick() {
        this.show_marker_center = !this.show_marker_center;
      },
      // markerLocationCssStyle() {
      //   if (this.show_marker_drag)
      //     return ("e-warning");
      //   else
      //     return ("e-outline");
      // },
      // markerHideGeojsonEventClick() {
      //   this.show_geo_json = !this.show_geo_json;
      // },
      markerLocationEventClick() {
        this.show_marker_drag = !this.show_marker_drag;
      },
      markerWellEventClick() {
        this.show_well_marker = !this.show_well_marker;
        this.editOpenGatherDialogShow();
      },
      markerWellCssStyle() {
        if (this.show_well_marker)
          return ("e-warning");
        else
          return ("e-outline");
      },
      downloadSelectedWell()
      {
        this.showLoader = true;
        let str_url = this.varRouter.getHttpType("well-list-info") + this.objParam["id_area"];
        this.$store.dispatch('http_get', [str_url, {}, this.event_http_well_download]).then();
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
          user: this.user["user"],
          data: this.proposeProspect
        };
        // console.log(JSON.stringify(param))
        // param["data"]["polygon"] = this.geo_json[0]["geometry"]["coordinates"][0];
        // console.log(JSON.stringify(param))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("potprosp-score"), param, this.event_http_prospect_score]).then();
      },
      onClickSaveProject() {
        // this.prospectScore.score["confidence"] = this.confidence_score;
        // this.prospectScore.score["note"] = this.text_note;
        let param = {
          user: this.user["user"],
          data: this.proposeProspect,
          // score: this.prospectScore.score
        };
        // param["data"]["polygon"] = this.geo_json;
        // console.log(JSON.stringify(param));

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-update"), param, this.event_http_save_prospect]).then();
      },
      onClickViewGather() {
        // console.log(JSON.stringify(this.objParam))
        let routeData = this.$router.resolve({
          // path: "plot-ava-gather",
          path: "plot-ava-gather-section",
          query: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      onUncheckAll() {
        uncheckAllData(this.table_prospect_map);
      },
      httpGetProspectData() {
        let param = {
          user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-data"), param, this.event_http_prospect_map]).then();
      },
      httpFindGatherFromMapMarker() {
        let param = {
          user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
            x: this.marker_drag_coord.lat*1.0,
            y: this.marker_drag_coord.lng*1.0,
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-find-gather-from-latlng"),
          param, this.event_http_find_gather_from_latlng]).then();
      },
      httpOpenGatherFromMapMarker()
      {
        this.marker_drag_coord["gather"]["z"]["min"] = this.marker_drag_coord["gather"]["z"]["min"]*1.0;
        this.marker_drag_coord["gather"]["z"]["max"] = this.marker_drag_coord["gather"]["z"]["max"]*1.0;
        let routeData = this.$router.resolve({
          path: "plot-ava-gather-section",
          query: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
            iline: this.marker_drag_coord["gather"]["iline"],
            xline: this.marker_drag_coord["gather"]["xline"],
            zmin: this.marker_drag_coord["gather"]["z"]["min"],
            zmax: this.marker_drag_coord["gather"]["z"]["max"],
          }
        });
        // console.log(JSON.stringify(this.marker_drag_coord))
        window.open(routeData.href, '_blank');
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

      EventBus.$on(this.event_http_prospect_score.success, (msg) => {
        this.prospectScore = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_prospect_score.fail, (msg) => {
        this.showLoader = false;
        this.prospectScore = {score: {np: 0, score: 0, area: 0}};
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_prospect_map.success, (msg) => {
        this.prospectMap = msg.data;
        this.table_prospect_map = addPlotDataToProspectEditMultiData(this.prospectMap);
        this.heatmap_range = this.prospectMap.v_min_max;

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

      EventBus.$on(this.event_http_save_prospect.success, (msg) => {
        saveProspectData(this.objParam);
        this.showLoader = false;

        this.retStatus.title = "Success";
        this.retStatus.message = "Update data completed";
        this.$refs.dialogMessage.showModal();
      });
      EventBus.$on(this.event_http_save_prospect.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_find_gather_from_latlng.success, (msg) => {
        this.marker_drag_coord.gather = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_find_gather_from_latlng.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // WELL GET LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_well_download.success, (msg) => {
        let n = msg.data.length;
        this.well_marker = [];
        for(let i=0; i<n; i++)
        {
          let item = msg.data[i];
          this.well_marker.push({
            data: [[item.yst, item.xst], [item.yen, item.xen]],
            name: item["well_id"]
          })
        }
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_well_download.fail, (msg) => {
        this.well_marker = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http_prospect_score.success);
      EventBus.$off(this.event_http_prospect_score.fail);
      EventBus.$off(this.event_http_prospect_map.success);
      EventBus.$off(this.event_http_prospect_map.fail);
      EventBus.$off(this.event_http_save_prospect.success);
      EventBus.$off(this.event_http_save_prospect.fail);
      EventBus.$off(this.event_http_find_gather_from_latlng.success);
      EventBus.$off(this.event_http_find_gather_from_latlng.fail);
      EventBus.$off(this.event_http_well_download.success);
      EventBus.$off(this.event_http_well_download.fail);
    },
  }
</script>

<style scoped>
</style>
