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
<!--        <b-button-group size="md">-->
<!--          <b-button class="mr-1" variant="dark" @click="showHideChartSeismic()"><i class="btn_toolbar fa fa-image"></i></b-button>-->
<!--          <b-button class="mr-1" variant="dark" @click="showHideChartLine()"><i class="btn_toolbar fa fa-line-chart"></i></b-button>-->
<!--        </b-button-group>-->
        <b-dropdown size="sm" variant="dark" :text="getDropdownNeighbor()">
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
      </b-button-toolbar>
    </div>

    <splitpanes class="default-theme" vertical style="height: 77vh" @resized="splitResizedEvent('resized', $event)">
      <pane min-size="20" max-size="80">
        <LChartSeismic class="lc_seismic_chart" :title="dataTitle" :points="points" :xaxis="XAxis" :yaxis="YAxis" @pointInLcAxis="updateLcPoint($event)"/>
      </pane>
      <pane>
        <ApexChartLine class="lc_seismic_chart" :chart-options="lineChartOptions" :series="lineSeries"/>
      </pane>
    </splitpanes>
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

  export default {
    name: 'SeismicView',
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    components: {
      ApexChartLine,
      LChartLine,
      LChartSeismic,
      Splitpanes, Pane
    },

    data: () =>
    {
      return {
        showLoader: true,

        myTitle: {},
        nNeighbor: 0,
        timePos: 0,
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
      this.getDemoData();
      // this.getListData();
    },
    methods: {
      splitResizedEvent(strinfo, event)
      {
        this.createChartInfo();
      },
      updateLcPoint(e)
      {
        this.timePos = Math.round(e.y);
        if(e.isValid)
          this.createChartInfo();
      },
      setNeighbor(ii)
      {
        this.nNeighbor = ii;
        this.createChartInfo();
      },
      getDropdownNeighbor()
      {
        return("Neighbor ( " + this.nNeighbor + " ) ");
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
        this.$store.dispatch('http_get', ["/api/segy/trace-view/1/1000", {}, this.event_http]).then();
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

        for(let k=t1; k<=t2; k++)
        {
          let tmp = [];
          for (let i = 0; i < this.points[0].length; i++)
          {
            tmp.push(this.points[k][i]);
          }
          let line_title = ((nsp-k-1) * this.YAxis["sampling"]+this.YAxis["start"]);
          this.lineSeries.push({
            type: 'line',
            name: line_title,
            data: tmp
          });
        }

        this.lineChartTitle = this.dataTitle + ", " + this.YAxis["label"] + " : " + ((nsp-pp-1)*this.YAxis["sampling"] + this.YAxis["start"]);
        this.lineChartOptions = createDefaultParam();
        this.lineChartOptions["title"]["text"] = this.lineChartTitle;
        this.lineChartOptions["xaxis"]["categories"] = this.XAxis["data"];
        this.lineChartOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        this.lineChartOptions["yaxis"]["title"]["text"] = "Amplitude";
        this.lineChartOptions["colors"] = createDefaultColor(t1, t2, pp);
        this.lineChartOptions["markers"] = createDefaultMarker(t1, t2, pp, 4, 0)
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
            tmp0.push(tmp[j][i])
          this.points.push(tmp0);
        }

        this.XAxis = msg["x"];
        this.YAxis = msg["y"];
        this.XAxis["data"] = msg["cdp_header"];

        this.dataTitle = "CDP NO : " + msg["cdp_no"];
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
