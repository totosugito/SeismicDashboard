<template>
  <div>
    <b-card header="Dynamic input for map" class="text-left">
      <div>
        <div>{{param[0].title}}</div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[0].min" :max="param[0].max" :step="param[0].step"
                                :value="param[0].vmin" format="n0"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[0].min" :max="param[0].max" :step="param[0].step"
                                :value="param[0].vmax" format="n0"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-2">
        <div>{{param[1].title}}</div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[1].min" :max="param[1].max" :step="param[1].step"
                                :value="param[1].vmin" format="n0"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[1].min" :max="param[1].max" :step="param[1].step"
                                :value="param[1].vmax" format="n0"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-2">
        <div>{{param[2].title}}</div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[2].min" :max="param[2].max" :step="param[2].step"
                                :value="param[2].vmin" v-model="param[2].vmin" format="n2"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[2].min" :max="param[2].max" :step="param[2].step"
                                :value="param[2].vmax" v-model="param[2].vmax" format="n2"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-3">
        <ejs-button cssClass='e-success' class="mr-2 mb-2" v-on:click.native='onClickRefreshSection'>Refresh Sections</ejs-button>
        <ejs-button cssClass='e-info' class="mb-2" v-on:click.native='onClickViewProspect'>View Prospect Map</ejs-button>
      </div>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {NumericTextBoxPlugin} from "@syncfusion/ej2-vue-inputs";

  Vue.use(NumericTextBoxPlugin);
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';

  Vue.use(ButtonPlugin);

  export default {
    name: "DynamicInputForMap",
    props: {
      param: {
        type: Array,
        required: false,
        default: function () {
          return [
            {
              title: "InLine",
              min: 1,
              max: 3201,
              step: 1,
              min: 1,
              max: 4000,
              vmin: 20,
              vmax: 80
            },
            {
              title: "XLine",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100,
              vmin: 20,
              vmax: 80
            },
            {
              title: "Depth",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100,
              vmin: 20,
              vmax: 80
            }
          ]
        }
      },
    },
    watch :
      {
      },
    methods: {
      onClickRefreshSection()
      {
        let val = this.param;
        this.$emit('onClickRefreshSection', val);
      },
      onClickViewProspect()
      {
        this.$emit('onClickViewProspect', this.param);
      },
    },
  }
</script>

<style scoped>

</style>
