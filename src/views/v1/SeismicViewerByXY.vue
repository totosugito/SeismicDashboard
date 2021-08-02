<template>

  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :size="spinLoader.size"
      :active="showLoader"
      :background-color="spinLoader.background_color"/>

    <splitpanes class="default-theme" vertical style="height: 88vh" vertical>
      <pane class="p-2" min-size="20" max-size="40" style="background: white">
        <DynamicInputForMap @onClickRefreshSection="dynamicInputOnClickRefreshSection" @onClickViewProspect="dynamicInputOnClickViewProspect"/>
      </pane>
      <pane class="p-2" min-size="40" max-size="80" style="background: white">
    <div>
      <b-button-toolbar aria-label="Toolbar with button groups and input groups" class="mb-1">
        <b-dropdown size="sm" class="mr-0">
          <template slot="button-content" class="pr-1" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(colormap.id)" size="sm"/><span
            class="pl-1">{{fgetColormapName(colormap.id)}}</span>
          </template>

          <b-dropdown-item @click="setColormap(0)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(0)"/> {{fgetColormapName(0)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(1)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(1)"/> {{fgetColormapName(1)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(2)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(2)"/> {{fgetColormapName(2)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(3)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(3)"/> {{fgetColormapName(3)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(4)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(4)"/> {{fgetColormapName(4)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(5)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(5)"/> {{fgetColormapName(5)}}
          </b-dropdown-item>
        </b-dropdown>
        <!--        <b-form-checkbox v-model="reverseColormap" class="mr-1">Rev</b-form-checkbox>-->
        <enhanced-check label="Rev" style="height: 20px;" v-model="reverseColormap" class="mr-2"></enhanced-check>

        <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
          <b-input-group-prepend class="mr-1">
            <span style="color: white">Min ({{cmin}})</span>
          </b-input-group-prepend>
          <b-form-slider style="height:20px;" v-model="tmp_cmin" @slide-stop="slideStopMin" :min="0" :max="99"></b-form-slider>
        </b-input-group>
        <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
          <b-input-group-prepend class="mr-1">
            <span style="color: white">Max ({{cmax}})</span>
          </b-input-group-prepend>
          <b-form-slider style="height:20px;" v-model="tmp_cmax" @slide-stop="slideStopMax" :min="0" :max="99"></b-form-slider>
        </b-input-group>
      </b-button-toolbar>
    </div>

    <b-container fluid>
      <b-row>
        <template v-for="seismic in seismics">
          <b-col>
            <LChartSeismicAreaSelected
              class="lc_seismic_chart"
              :colormap="colormap"
              :title="seismic.file_name"
              :points="seismic.cdp_data"
              :xaxis="seismic.x"
              :yaxis="seismic.y"
              :boundaryX="seismic.boundaryX"
              :boundaryY="boundaryY"
              :cmin="cmin"
              :cmax="cmax"
            />
          </b-col>
        </template>
      </b-row>
    </b-container>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {getData, getSectionData} from "../../libs/data";
  import LChartSeismicAreaSelected from "../components/LChartSeismicAreaSelected";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'

  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import DynamicInputForMap from "../myview/DynamicInputForMap";
  import {appDemoMode} from "../../_constant/http_api";
  import {rotate, rotate90} from "../../libs/2d-array-rotation";

  export default {
    name: "SeismicViewerByXY",

    components: {
      DynamicInputForMap,
      LChartSeismicAreaSelected,
      EnhancedCheck,
      bFormSlider,

      Splitpanes, Pane,
    },

    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    data: () =>
    {
      return {
        bdemo: appDemoMode(),
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: false,
        lat: 0,
        lng: 0,

        datas: [],
        seismics: [],
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

        event_http_get_section: {success: "successGetSection", fail: "failGetSection"},
      }
    },
    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function ()
    {
      this.lat = this.$route.query.lat;
      this.lng = this.$route.query.lng;
      if (this.bdemo) {
        this.fillDataVariable(getSectionData());
        this.showLoader = false;
      } else
        this.httpGetSection();
    },
    methods: {
      dynamicInputOnClickRefreshSection(val)
      {
        console.log(JSON.stringify(val));
      },
      dynamicInputOnClickViewProspect(val)
      {
        console.log(JSON.stringify(val));
      },

      fgetColormapName(ii)
      {
        return (getColormapName(ii))
      },
      setColormap(ii)
      {
        this.colormap = {id: ii, reverse: this.reverseColormap};
      },

      fgetColormapAsset(ii)
      {
        return (getColormapAsset(ii))
      },
      slideStopMin()
      {
        this.cmin = this.tmp_cmin;
      },
      slideStopMax()
      {
        this.cmax = this.tmp_cmax;
      },

      httpGetSection() {
        let param = {
          "state": 0,
          "type": "/api/heatmap/find-sandbox",
          "mesg": "",
          "data": {
            "id_area": 2,
            "x": this.lng,
            "y": this.lat,
            // "x": 550766.97,
            // "y": 9912090.44
          }
        };
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("get_section_data"), param, this.event_http_get_section]).then();
      },

      fillDataVariable(tmp)
      {
        this.datas = tmp;
        this.seismics = this.datas;
        for(let i=0; i<this.datas.length; i++) {
          this.seismics[i]["cdp_data"] = rotate(this.datas[i]["cdp_data"], -90);
          this.seismics[i]["x"]["data"] = this.seismics[i]["cdp_header"];

          let ntrc = this.seismics[i]["ntrace"];
          this.seismics[i]["boundaryX"] = {
            p1: this.seismics[i]["cdp_header"][0] + Math.round(ntrc/2),
            p2: this.seismics[i]["cdp_header"][ntrc-1] - Math.round(ntrc/2)
          };
        }
        this.boundaryY["p1"] = 200;
        this.boundaryY["p2"] = 300;
      }
    },

    mounted()
    {
      EventBus.$on(this.event_http_get_section.success, (msg) =>
      {
        this.fillDataVariable(msg.data);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_get_section.fail, (msg) =>
      {
        this.datas = [];
        this.seismics = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy()
    {
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
    },
    watch:
      {
        reverseColormap: function (val)
        {
          this.reverseColormap = val;
          this.setColormap(this.colormap["id"]);
        },
      }
  }
</script>

<style lang="scss" scoped>
  .lc_seismic_chart {
    height: 83vh;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }
</style>
