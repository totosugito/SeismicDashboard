<template>
<div>
  <view-process-wizard-button :icon="tabicon" :title="tabtitle" :index="2" :textsize="190" class="mb-3"/>
        <template v-if="showLoader===false">
<!--        <proc-map-window class="style_chart_proc" :colormap="colormap" :points="points" :xaxis="XAxis" :yaxis="YAxis" :perc="perc" :title="dataTitle"/>-->
        <LChartSeismic class="style_chart_proc" :colormap="colormap" :points="points" :xaxis="XAxis" :yaxis="YAxis" :perc="perc" :title="dataTitle"></LChartSeismic>
      </template>
  <view-bottom-wizard-button class="mt-2" index="2" :left_clicked="wizardButtonClicked('processwizard2')" :right_clicked="wizardButtonClicked('processwizard4')"/>
</div>
</template>

<script>
  import {getData} from "../../libs/data";
  import LChartSeismic from "../components/LChartSeismic";
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";

  export default {
    name: "ProcessWizardStep3",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      LChartSeismic
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data()
    {
      return {
        showLoader: true,

        tabicon: ["fa fa-wpforms", "fa fa-map", "fa fa-window-restore", "fa fa-map-marker", "fa fa-line-chart", "fa fa-pie-chart"],
        tabtitle: ["Input Parameter", "Map Window", "Section", "Map Propagation", "Data Trend", "Recomendation"],
        colormap: 1,
        perc: 10,
        points: [],
        XAxis: {},
        YAxis: {},
        dataTitle: ""
      }
    },

    beforeMount: function ()
    {
      this.getDemoData();
    },

    methods: {
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
          "start": 0
        };
        this.points = getData();
        let data = [];
        for (let i = 0; i < this.points[0].length; i++)
          data.push(i);
        this.XAxis["data"] = data;
        this.dy = this.YAxis["sampling"];
        this.dataTitle = "";

        this.showLoader = false;
      },

      wizardButtonClicked(str_router) {
        return(this.varRouter.getRoute(str_router, 1))
      }
    }
  }
</script>

<style scoped>
  .style_chart_proc {
    height: 65vh;
  }
</style>
