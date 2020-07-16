<template>
  <div class="image">
    <div @click="myevent()" :id="chartId" class="image"></div>
    <div class="overlay">{{TmpPoint}}</div>
  </div>
</template>

<script>
  import {ColorHEX, ColorRGBA, lightningChart, PalettedFill, SolidFill, translatePoint} from '@arction/lcjs'
  import {get2dColSize, get2dMaxData, get2dMinData, get2dRowSize, getLcColormap} from "../../libs/colormap";
  import {createColorObject} from "../../libs/libLC";

  export default {
    name: "LChartSeismic",
    props: ['title', 'points', 'xaxis', 'yaxis'],
    data()
    {
      return {
        chart: null,
        chartId: null,
        ns: 0,
        ntrc: 0,

        TmpPoint: '',
        tmpEvent: null,
        defForeColor: "#000000",
        defColor: {
          background: ColorRGBA(250, 250, 250),
          linecolor: ColorRGBA(65, 105, 225),
          default: ColorRGBA(0, 0, 0),
        },
        grColor: null,
        pointInLcAxis: {}
      }
    },
    methods: {

      isValidTrace(tmp_point)
      {
        // if(tmp_point.x < 0 || tmp_point.x >= this.ntrc)
        //   return(false);

        if(tmp_point.x < this.xaxis["data"][0] || tmp_point >= this.xaxis["data"][this.ntrc - 1])
          return (false)

        if(tmp_point.y < this.yaxis["start"])
          return (false)

        return (true);
      },
      createChart()
      {
        if (this.chart !== null)
          this.chart.dispose();

        let ii = 0;
        this.grColor = createColorObject(this.defColor);

        // Create chartXY
        this.chart = lightningChart().ChartXY({containerId: `${this.chartId}`})
          .setTitleFillStyle(this.grColor.default)
          .setBackgroundFillStyle(this.grColor.background)
          .setChartBackgroundFillStyle(this.grColor.background);
        this.chart.setTitle(this.title);

        // Create LUT and FillStyle
        this.minData = get2dMinData(this.points) + 20;
        this.maxData = get2dMaxData(this.points) - 70;

        let mm_data = 0;
        if(Math.abs(this.minData) > Math.abs(this.maxData))
          mm_data = Math.abs(this.minData) * 10.0 / 100.0;
        else
          mm_data = Math.abs(this.maxData) * 10.0 / 100.0;
        this.minData = this.minData + mm_data;
        this.maxData = this.maxData - mm_data;

        this.palette = getLcColormap(ii, this.minData, this.maxData);

        this.ntrc = get2dColSize(this.points);
        this.ns = get2dRowSize(this.points);
        let resolutionX = this.ns;
        let resolutionY = this.ntrc;
        let customX = this.chart.addAxisX(true)
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(0, this.ntrc)
          .setTitle(this.xaxis["label"]);
        let customY = this.chart.addAxisY(false)
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(this.yaxis["start"], this.yaxis["start"] + (this.ns * this.yaxis["sampling"]))
          .setTitle(this.yaxis["label"]);
        this.chart.addHeatmapSeries({
          rows: resolutionX,
          columns: resolutionY,
          start: {x: this.xaxis["data"][0], y: this.yaxis["start"] + (this.ns * this.yaxis["sampling"])},
          end: {x: this.xaxis["data"][this.ntrc - 1], y: this.yaxis["start"]},
          pixelate: false,
          xAxis: customX,
          yAxis: customY
        })
          .setMouseInteractions(true)
          // Add data and invalidate the Series based on added data.
          .invalidateValuesOnly(this.points)
          .setFillStyle(new PalettedFill({lut: this.palette}));
        this.chart.getDefaultAxisX().dispose();
        this.chart.getDefaultAxisY().dispose();

        document.addEventListener('mousemove', (event) =>
        {
          this.tmpEvent = event;
          let tmp_point = translatePoint(
            this.chart.engine.clientLocation2Engine(this.tmpEvent.clientX, this.tmpEvent.clientY),
            this.chart.engine.scale,
            {
              x: this.chart.getDefaultAxisX().scale,
              y: this.chart.getDefaultAxisY().scale
            }
          )

          if(this.isValidTrace(tmp_point))
          {
            let y1 = Math.round((tmp_point.y - this.yaxis["start"]) / this.yaxis["sampling"]);
            let y2 = y1 * this.yaxis["sampling"] + this.yaxis["start"];
            this.TmpPoint = this.xaxis["label"] + " : " + Math.round(tmp_point.x) +
              " ,  " + this.yaxis["label"] + " : " + y2;
          }
        })
      },

      myevent()
      {
        this.pointInLcAxis = translatePoint(
          this.chart.engine.clientLocation2Engine(this.tmpEvent.clientX, this.tmpEvent.clientY),
          this.chart.engine.scale,
          {
            x: this.chart.getDefaultAxisX().scale,
            y: this.chart.getDefaultAxisY().scale
          }
        )
      }
    },

    watch: {
      pointInLcAxis(val)
      {
        if (val)
        {
          val["isValid"] = this.isValidTrace(val);
          this.$emit('pointInLcAxis', val);
        }
      }
    },
    mounted()
    {
      // Chart can only be created when the component has mounted the DOM because
      // the chart needs the element with specified containerId to exist in the DOM
      this.createChart();
    },

    beforeMount()
    {
      // Generate random ID to us as the containerId for the chart and the target div id
      this.chartId = Math.trunc(Math.random() * 1000000)
    },

    beforeDestroy()
    {
      // "dispose" should be called when the component is unmounted to free all the resources used by the chart
      this.chart.dispose()
    }
  }
</script>

<style scoped>
  .image {
    height: 97%;
    position: relative;
    z-index: 1;
  }
  .overlay {
    position: relative;
    z-index: 2;
  }
</style>
