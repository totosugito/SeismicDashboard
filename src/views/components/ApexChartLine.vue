<template>
  <div>
    <apexcharts
      style="background: whitesmoke"
      height="100%"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
  import VueApexCharts from "vue-apexcharts";

  export default {
    name: "ApexChartLine",
    props: ['chartOptions', 'series'],
    components: {
      apexcharts: VueApexCharts
    },
    methods: {
    },
    data: function ()
    {
      return {
      };
    },
  }
</script>

<style scoped>

</style>
