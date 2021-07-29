<template>
  <div>
    <b-card header="Dynamic input for map" class="text-left">
      <div>
        <div>{{param.iline.title}}</div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param.iline.min" :max="param.iline.max" :step="param.iline.step"
                                :value="param.iline.min" v-model="param.iline.min" format="n0"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param.iline.min" :max="param.iline.max" :step="param.iline.step"
                                :value="param.iline.max" v-model="param.iline.max" format="n0"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-2">
        <div>{{param.xline.title}}</div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param.xline.min" :max="param.xline.max" :step="param.xline.step"
                                :value="param.xline.min" v-model="param.xline.min" format="n0"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param.xline.min" :max="param.xline.max" :step="param.xline.step"
                                :value="param.xline.max" v-model="param.xline.max" format="n0"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-2">
        <div>{{param.depth.title}}</div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param.depth.min" :max="param.depth.max" :step="param.depth.step"
                                :value="param.depth.min" v-model="param.depth.min" format="n2"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param.depth.min" :max="param.depth.max" :step="param.depth.step"
                                :value="param.depth.max" v-model="param.depth.max" format="n2"/>
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
        type: Object,
        required: false,
        default: function () {
          return {
            iline: {
              title: "InLine",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100
            },
            xline: {
              title: "XLine",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100
            },
            depth: {
              title: "Depth",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100
            }
          }
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
