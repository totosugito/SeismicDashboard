<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :size="spinLoader.size"
      :active="showLoader"
      :background-color="spinLoader.background_color"/>

    <div>
      <b-button-toolbar aria-label="Toolbar with button groups and input groups" class="mb-1">


        <b-input-group size="sm" :prepend="YAxis.label">
          <b-form-input v-model="timePos" class="text-right" style="width: 70px"></b-form-input>
        </b-input-group>
        <b-button size="sm" class="ml-1 mr-3" @click="applyTimePosClicked()" variant="dark">Apply</b-button>

        <b-dropdown size="sm" variant="dark" :text="getDropdownNeighbor()" class="mr-2">
          <b-dropdown-item-button @click="setNeighbor(0)">0</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(1)">1</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(2)">2</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(3)">3</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(4)">4</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(5)">5</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(6)">6</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(7)">7</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(8)">8</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(9)">9</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(10)">10</b-dropdown-item-button>
        </b-dropdown>

        <b-dropdown size="sm" variant="dark" :text="getDropdownMode()" class="mr-2">
          <b-dropdown-item-button @click="setChartMode('off')">Off</b-dropdown-item-button>
          <b-dropdown-item-button @click="setChartMode('min')">Min</b-dropdown-item-button>
          <b-dropdown-item-button @click="setChartMode('max')">Max</b-dropdown-item-button>
          <b-dropdown-item-button @click="setChartMode('opt')">Opt</b-dropdown-item-button>
        </b-dropdown>

        <b-dropdown size="sm" class="mr-1">
          <template slot="button-content" class="pr-2" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(colormap)" size="sm"/><span class="pl-1">{{fgetColormapName(colormap)}}</span>
          </template>

          <b-dropdown-item @click="setColormap(0)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(0)" /> Sharp
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(1)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(1)"/> Yrwbc
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(2)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(2)" /> Seismic
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(3)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(3)" /> Petrel
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(4)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(4)" /> Gray
          </b-dropdown-item>
        </b-dropdown>

        <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
          <b-input-group-prepend class="mr-1">
            <span style="color: white">perc :</span>
          </b-input-group-prepend>
          <b-form-slider class="height=30px" v-model="tmpPlotPerc" @slide-stop="slideStop" :min="0" :max="100"></b-form-slider>
        </b-input-group>
      </b-button-toolbar>
    </div>

    <splitpanes class="default-theme" vertical style="height: 77vh" @resized="splitResizedEvent('resized', $event)">
      <pane min-size="20" max-size="80">
        <template v-if="showLoader==false">
          <LChartSeismic class="lc_seismic_chart" :colormap="colormap" :resizeevent="resizeevent"
                         :perc="plotPerc" :title="dataTitle"
                         :points="points" :xaxis="XAxis" :yaxis="YAxis" @pointInLcAxis="updateLcPoint($event)"/>
        </template>
      </pane>
      <pane>
        <template v-if="showLoader==false">
        <ApexChartLine class="lc_seismic_chart" :chart-options="lineChartOptions" :series="lineSeries"/>
        </template>
      </pane>
    </splitpanes>

<!--    <vue-form-dialog-->
<!--      ref="dataDialog"-->
<!--      type="default"-->
<!--      header="Parameters" body="Body"-->
<!--      btn1_text="Close" btn2_text="Process"-->
<!--      btn1_style="danger" btn2_style="primary">-->
<!--&lt;!&ndash;      @btn1Click="radiusDialogBtn1Click()" @btn2Click="radiusDialogBtn2Click()">&ndash;&gt;-->

<!--      &lt;!&ndash; body slot &ndash;&gt;-->
<!--&lt;!&ndash;      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">&ndash;&gt;-->
<!--&lt;!&ndash;              <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated"/>&ndash;&gt;-->
<!--&lt;!&ndash;            </span>&ndash;&gt;-->
<!--    </vue-form-dialog>-->
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import LChartLine from '../components/LChartLine'
  import LChartSeismic from '../components/LChartSeismic'
  import {getData} from "../../libs/data";
  import ApexChartLine from "../components/ApexChartLine";
  import {createDefaultColor, createDefaultMarker, createDefaultParam} from "../../libs/defApexChartLine";
  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import {matrix_col_optimum} from "../../libs/test_max_min_val_each_column";
  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  // import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  // import clusterize from "vue-clusterize"

  export default {
    name: 'SeismicViewer',
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    components: {
      ApexChartLine,
      LChartLine,
      LChartSeismic,
      Splitpanes, Pane,
      bFormSlider,
      // VueFormDialog,
      // "clusterize": clusterize
    },

    data: () =>
    {
      return {
        showLoader: true,

        resizeevent: false,
        colormap: 0,
        modeMinMax: "min",
        plotPerc: 20,
        tmpPlotPerc: 20,
        myTitle: {},
        nNeighbor: 0,
        timePos: 0,
        bApplyTimePos: false,
        points: [],
        lcpoints: [],
        dataTitle: "",
        lineChartTitle: '',
        XAxis: {},
        YAxis: {},
        lineSeries: [],
        lineChartOptions: {},
        event_http: {success: "success", fail: "fail"},
      }
    },
    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function ()
    {
      // this.getDemoData();
      this.getListData();
    },
    methods: {
      fgetColormapName(ii)
      {
        return(getColormapName(ii))
      },
      fgetColormapAsset(ii)
      {
        return(getColormapAsset(ii))
      },

      slideStop () {
        this.plotPerc = this.tmpPlotPerc;
      },

      splitResizedEvent(strinfo, event)
      {
        this.resizeevent = !this.resizeevent;
        this.createChartInfo();
      },
      updateLcPoint(e)
      {
        this.timePos = Math.round(e.y);
        if(e.isValid)
          this.createChartInfo();
      },
      setChartMode(ii)
      {
        this.modeMinMax = ii;
        this.createChartInfo();
      },
      setNeighbor(ii)
      {
        this.nNeighbor = ii;
        this.createChartInfo();
      },
      setColormap(ii)
      {
        this.colormap = ii;
      },
      getDropdownNeighbor()
      {
        return("Neighbor ( " + this.nNeighbor + " ) ");
      },
      getDropdownMode()
      {
        return("Mode ( " + this.modeMinMax + " ) ");
      },
      getColormapColor()
      {
        return("Colormap : " + getColormapName(this.colormap));
      },

      getDemoData()
      {
        this.XAxis = {
          "label": "Offset (m)",
          "sampling": 1,
          "start": 0
        };
        this.YAxis = {
          "label": "Depth (m)",
          "sampling": 2,
          "start": 50
        };
        this.points = getData();
        let data = [];
        for (let i = 0; i < this.points[0].length; i++)
          data.push(i);
        this.XAxis["data"] = data;

        this.dataTitle = "CDP NO : 1";
        this.createChartInfo();
        this.showLoader = false;
      },
      getListData()
      {
        this.showLoader = true;
        let str_st = this.$route.query.st;
        let str_en = this.$route.query.en;
        // this.plotPerc = this.$route.query.perc*1;
        // if(this.plotPerc === undefined)
        //   this.plotPerc = 20;

        let cur_url = "api/segy/trace-view/" + str_st + "/" + str_en;
        this.$store.dispatch('http_get', [cur_url, {}, this.event_http]).then();
      },
      applyTimePosClicked()
      {
        this.bApplyTimePos = true;
        this.createChartInfo();
      },
      createChartInfo()
      {
        this.lineSeries = [];

        let nsp = this.points.length;
        let tidx = Math.floor(this.timePos / this.YAxis["sampling"]);
        let dx = Math.floor(this.YAxis["start"] / this.YAxis["sampling"]);

        let pp = nsp-tidx-1 + dx;
        if(pp<0)
        {
          pp = 0;
          this.timePos = this.YAxis["start"] + (this.YAxis["sampling"]*nsp) - 1;
        }
        else if(pp>=nsp)
        {
          pp = nsp - 1;
          this.timePos = this.YAxis["start"];
        }

        let t1 = pp - this.nNeighbor;
        let t2 = pp + this.nNeighbor;
        if(t1<0) t1 = 0;
        if(t2>nsp) t2 = nsp-1;

        let ArrModeMinMax = [];
        for(let k=t2; k>=t1; k--)
        {
          let tmp = [];
          for (let i = 0; i < this.points[0].length; i++)
          {
            tmp.push(this.points[k][i]);
          }
          let line_title = ((nsp-k-1) * this.YAxis["sampling"] + this.YAxis["start"]);
          this.lineSeries.push({
            type: 'line',
            name: line_title,
            data: tmp
          });
          ArrModeMinMax.push(tmp);
        }

        // plot min max data
        if(this.modeMinMax !== 'off')
        {
          let nx = this.points[0].length;
          let v_data_minmax = matrix_col_optimum(t2 - t1 + 1, nx, this.modeMinMax, ArrModeMinMax);
          this.lineSeries.push({
            type: 'line',
            name: "Mode : " + this.modeMinMax,
            data: v_data_minmax
          });
        }

        this.lineChartTitle = this.dataTitle + ", " + this.YAxis["label"] + " : " + ((nsp-pp-1)*this.YAxis["sampling"] + this.YAxis["start"]);
        this.lineChartOptions = createDefaultParam();
        this.lineChartOptions["title"]["text"] = this.lineChartTitle;
        this.lineChartOptions["xaxis"]["categories"] = this.XAxis["data"];
        this.lineChartOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        this.lineChartOptions["yaxis"]["title"]["text"] = "Amplitude";
        this.lineChartOptions["colors"] = createDefaultColor(t1, t2+1, [pp, t2+1]);
        this.lineChartOptions["markers"] = createDefaultMarker(t1, t2+1, [pp, t2+1], 4, 0)

        if(this.bApplyTimePos === false)
          this.timePos = (nsp-pp-1)*this.YAxis["sampling"] + this.YAxis["start"];

        this.bApplyTimePos = false;
      }

    },

    mounted()
    {
      EventBus.$on(this.event_http.success, (msg) =>
      {
        this.points = [];
        let tmp = msg["cdp_data"];
        for (let i = tmp[0].length - 1; i >= 0; i--)
        {
          let tmp0 = [];
          for (let j = 0; j < tmp.length; j++)
            tmp0.push(tmp[j][i]);
          this.points.push(tmp0);
        }

        this.XAxis = msg["x"];
        this.YAxis = msg["y"];
        this.XAxis["data"] = msg["cdp_header"];

        this.dataTitle = msg["title"] + msg["cdp_no"];
        this.createChartInfo();
        this.showLoader = false;
      });
      EventBus.$on(this.event_http.fail, (msg) =>
      {
        // printJson("INPUT --> ", msg);
      });
    },
    beforeDestroy()
    {
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
    },
  }
</script>

<style lang="scss" scoped>
  .lc_seismic_chart {
    height: 77vh;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }
</style>
