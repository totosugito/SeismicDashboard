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
        <b-button-group size="md">
          <b-button class="mr-1" variant="dark" @click="showHideChartSeismic()"><i class="btn_toolbar fa fa-image"></i></b-button>
          <b-button class="mr-1" variant="dark" @click="showHideChartLine()"><i class="btn_toolbar fa fa-line-chart"></i></b-button>
        </b-button-group>
        <b-input-group size="md" :prepend="YAxis.label">
          <b-form-input v-model="timePos" class="text-right" style="width: 70px"></b-form-input>
        </b-input-group>
        <b-button class="ml-1" @click="createChartInfo()" variant="dark">Apply</b-button>
      </b-button-toolbar>
    </div>

    <b-row>
      <template v-if="bShowChartSeismic===true">
        <b-col>
          <template v-if="showLoader===false">
            <LChartSeismic class="lc_seismic_chart" :title="dataTitle" :points="points" :xaxis="XAxis" :yaxis="YAxis"/>
          </template>
        </b-col>
      </template>
      <template v-if="bShowChartLine===true">
        <b-col>
          <template v-if="showLoader===false">
            <ApexChartLine class="lc_seismic_chart" :chart-options="lineChartOptions" :series="lineSeries"/>
          </template>
        </b-col>
      </template>
    </b-row>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import LChartLine from '../components/LChartLine'
  import LChartSeismic from '../components/LChartSeismic'
  import {getData} from "../../libs/data";
  import ApexChartLine from "../components/ApexChartLine";
  import {createDefaultParam} from "../../libs/defApexChartLine";

  export default {
    name: 'SeismicView',
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    data: () =>
    {
      return {
        showLoader: true,

        myTitle: {},
        bShowChartSeismic: true,
        bShowChartLine: true,
        timePos: 0,
        points: [],
        lcpoints: [],
        dataTitle: "",
        lineChartTitle: '',
        XLabel: "Offset",
        XAxis: {},
        YAxis: {},
        lineSeries: [],
        lineChartOptions: {},
        event_http: {success: "success", fail: "fail"},
      }
    },
    components: {
      ApexChartLine,
      LChartLine,
      LChartSeismic
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
      showHideChartSeismic()
      {
        this.bShowChartSeismic = !this.bShowChartSeismic;
      },
      showHideChartLine()
      {
        this.bShowChartLine = !this.bShowChartLine;
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
        this.$store.dispatch('http_get', ["/api/segy/cdp-view/5ef4767e91d10d9b0c2a038e/205353", {}, this.event_http]).then();
      },
      createChartInfo()
      {
        this.lineChartTitle = this.dataTitle + ', Time : ' + this.timePos;
        this.lineSeries = [];
        let tmp = [];

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
        for (let i = 0; i < this.points[0].length; i++)
        {
          tmp.push(this.points[pp][i]);
        }
        this.lineSeries.push({
          type: 'line',
          name: 'Raw Data',
          data: tmp
        });

        this.lineChartOptions = createDefaultParam();
        this.lineChartOptions["title"]["text"] = this.lineChartTitle;
        this.lineChartOptions["xaxis"]["categories"] = this.XAxis["data"];
        this.lineChartOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        this.lineChartOptions["yaxis"]["title"]["text"] = "Amplitude";
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
    height: 78vh;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }
</style>
