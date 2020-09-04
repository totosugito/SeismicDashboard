<template>
  <div class="panel-body">
    <view-process-wizard-button :icon="tabicon" :title="tabtitle" :index="0" :textsize="190" class="mb-3"/>

    <h4>AVA Navigation</h4>
    <vue-form-generator :schema="schema_ava" :model="model_ava" :options="formOptions"></vue-form-generator>
    <br>
    <h4>Map Propagation</h4>
    <vue-form-generator :schema="schema_mp" :model="model_mp" :options="formOptions"></vue-form-generator>

    <view-bottom-wizard-button class="mt-2" index="0" left_clicked="" :right_clicked="wizardButtonClicked('processwizard2')"/>
  </div>
</template>

<script>
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";

  export default {
    name: "ProcessWizardStep1",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      "vue-form-generator": VueFormGenerator.component,
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
        tabicon: ["fa fa-wpforms", "fa fa-map", "fa fa-window-restore", "fa fa-map-marker", "fa fa-line-chart", "fa fa-pie-chart"],
        tabtitle: ["Input Parameter", "Map Window", "Section", "Map Propagation", "Data Trend", "Recomendation"],

        model_ava: {
          geobodyava: "",
          xava: 0,
          yava: 0,
          zava: 0
        },
        model_mp: {
          mpsub: "",
          mpevent: ""
        },
        schema_ava: {
          fields: [
            {
              type: 'select',
              label: 'Choose Geobody',
              model: 'geobodyava',
              selectOptions : {
                hideNoneSelectedText: true
              },
              values: ['Geobody 1', 'Geobody 2', 'Geobody 3', 'Geobody 4']
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'X Coordinates',
              model: 'xava',
              placeholder: 'X Coordinates',
              featured: true,
              required: true
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Y Coordinates',
              model: 'yava',
              placeholder: 'Y Coordinates',
              featured: true,
              required: true
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Z Coordinates',
              model: 'zava',
              placeholder: 'Z Coordinates',
              featured: true,
              required: true
            },
          ]
        },
        schema_mp: {
          fields: [
            {
              type: 'select',
              label: 'Sub-stack Radius',
              model: 'mpsub',
              selectOptions: {
                hideNoneSelectedText: true
              },
              values: ['x m', 'y m', 'z m']
            },
            {
              type: 'select',
              label: 'Event',
              model: 'mpevent',
              selectOptions: {
                hideNoneSelectedText: true
              },
              values: ['Peak', 'Through', 'Peak/Through']
            },
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
      }
    },

    methods: {
      wizardButtonClicked(str_router) {
        return(this.varRouter.getRoute(str_router, 1))
      }
    }
  }
</script>

<style scoped>

</style>
