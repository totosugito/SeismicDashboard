<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <!--    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="cur_tab" :textsize="190"-->
    <!--                                class="mb-3"/>-->

    <b-row style="height: 88vh">
      <b-col md="8">
        <div>
          <!--          <b-card no-body>-->
          <b-tabs v-model="tabIndex">
            <b-tab title="Data by FIELD" :title-link-class="linkClass(0)">Tab contents 1</b-tab>
            <b-tab title="Data by WELL" :title-link-class="linkClass(1)">Tab contents 2</b-tab>
            <b-tab title="Well Files" :title-link-class="linkClass(2)">Tab contents 3</b-tab>
            <b-tab no-body title="Seismic Files" :title-link-class="linkClass(3)">

              <b-row>
                <b-col md="4">
                  <b-table style="height: 30vh"
                           show-empty
                           sticky-header="53vh"
                           :small="true"
                           :striped="true"
                           :bordered="true"
                           :outlined="true"
                           :current-page="currentPage"
                           :per-page="perPage"
                           :filter="filter"
                           @filtered="onFiltered"
                           :fields="table_headers"
                           :items="table_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
                <b-col md="4">
                  <b-table style="height: 30vh"
                           show-empty
                           sticky-header="53vh"
                           :small="true"
                           :striped="true"
                           :bordered="true"
                           :outlined="true"
                           :current-page="currentPage"
                           :per-page="perPage"
                           :filter="filter"
                           @filtered="onFiltered"
                           :fields="table_headers2"
                           :items="tmp_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
                <b-col md="4">
                  <b-table style="height: 30vh"
                           show-empty
                           sticky-header="53vh"
                           :small="true"
                           :striped="true"
                           :bordered="true"
                           :outlined="true"
                           :current-page="currentPage"
                           :per-page="perPage"
                           :filter="filter"
                           @filtered="onFiltered"
                           :fields="table_headers3"
                           :items="tmp_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-table style="height: 45vh"
                           show-empty
                           sticky-header="80vh"
                           :small="true"
                           :striped="true"
                           :bordered="true"
                           :outlined="true"
                           :current-page="currentPage"
                           :per-page="perPage"
                           :filter="filter"
                           @filtered="onFiltered"
                           :fields="table_headers4"
                           :items="tmp_datas">

                    <template v-slot:cell(id_color)="row">
                      <span class="fa fa-circle" :style="createStyleFromIndex(row.item)"
                            @click="eventSelectAreaClicked(row.index)"/>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
                      <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
          <!--          </b-card>-->
        </div>
      </b-col>
      <b-col md="4">
        <!--        <div class="col p-0" style="height: 100%; width: 100%">-->
        <template v-if="showLoader===false">
          <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">
            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"></l-tile-layer>
            <template v-for="(item, idx_poly) in map_polygon">
              <l-polygon :lat-lngs="item.polygon" :color="item.color">
                <l-popup :content="item.name"/>
              </l-polygon>
            </template>

            <Vue2LeafletHeatmap :lat-lng="markers_heatmap" :minOpacity="0.01" :max="0.5" :maxZoom="15" :blur="3"
                                :radius="3"></Vue2LeafletHeatmap>
          </l-map>
        </template>
        <!--        </div>-->
      </b-col>
    </b-row>


    <!--    <splitpanes class="default-theme" vertical style="height: 74vh" vertical>-->
    <!--      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">-->
    <!--        &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
    <!--        &lt;!&ndash; TABLE &ndash;&gt;-->
    <!--        &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
    <!--        &lt;!&ndash; table header &ndash;&gt;-->
    <!--        <div class="group-header">-->
    <!--          <b-row>-->
    <!--            <b-col md="2" class="my-1">-->
    <!--            </b-col>-->
    <!--            <b-col md="10" class="my-1">-->
    <!--              <b-form-group label-cols-lg="4" label-cols-md="3" label-cols-sm="6" class="mb-0">-->
    <!--                <b-input-group prepend="Filter : ">-->
    <!--                  <b-form-input v-model="filter" placeholder="Search"/>-->
    <!--                  <b-input-group-append>-->
    <!--                    <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>-->
    <!--                  </b-input-group-append>-->
    <!--                </b-input-group>-->
    <!--              </b-form-group>-->
    <!--            </b-col>-->
    <!--          </b-row>-->
    <!--        </div>-->

    <!--        <b-table-->
    <!--          show-empty-->
    <!--          sticky-header="53vh"-->
    <!--          :small="true"-->
    <!--          :striped="true"-->
    <!--          :bordered="true"-->
    <!--          :outlined="true"-->
    <!--          :current-page="currentPage"-->
    <!--          :per-page="perPage"-->
    <!--          :filter="filter"-->
    <!--          @filtered="onFiltered"-->
    <!--          :fields="table_headers"-->
    <!--          :items="table_datas">-->

    <!--          <template v-slot:cell(id_color)="row">-->
    <!--&lt;!&ndash;            <template v-if="row.item.plot===true">&ndash;&gt;-->
    <!--&lt;!&ndash;              <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>&ndash;&gt;-->
    <!--&lt;!&ndash;            </template>&ndash;&gt;-->
    <!--&lt;!&ndash;            <template v-else>&ndash;&gt;-->
    <!--              <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>-->
    <!--&lt;!&ndash;            </template>&ndash;&gt;-->
    <!--          </template>-->
    <!--          <template v-slot:cell(action)="row">-->
    <!--            <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>-->
    <!--            <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>-->
    <!--          </template>-->
    <!--        </b-table>-->

    <!--        &lt;!&ndash; table footer &ndash;&gt;-->
    <!--        <b-row>-->
    <!--          <b-col md="8" class="my-1">-->
    <!--            <b-pagination :total-rows="computeTotalRow()" :per-page="perPage" v-model="currentPage" class="my-0"/>-->
    <!--          </b-col>-->
    <!--          <b-col md="4" class="my-1">-->
    <!--            <b-input-group prepend="Per Page : ">-->
    <!--              <b-form-select :options="pageOptions" v-model="perPageView" v-on:change="showPerPage"/>-->
    <!--            </b-input-group>-->
    <!--          </b-col>-->
    <!--        </b-row>-->
    <!--      </pane>-->
    <!--      <pane class="pl-2 pt-2 pb-2 pr-0">-->
    <!--        <div class="col p-0" style="height: 100%; width: 100%">-->
    <!--          <template v-if="showLoader===false">-->
    <!--            <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"-->
    <!--                   :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">-->
    <!--              <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"></l-tile-layer>-->
    <!--              <template v-for="(item, idx_poly) in map_polygon">-->
    <!--                <l-polygon :lat-lngs="item.polygon" :color="item.color">-->
    <!--                <l-popup :content="item.name" />-->
    <!--                </l-polygon>-->
    <!--              </template>-->
    <!--            </l-map>-->
    <!--          </template>-->
    <!--        </div>-->
    <!--      </pane>-->
    <!--    </splitpanes>-->

    <!-- show error dialog -->
    <vue-simple-dialog
      ref="dialogMessage"
      type="danger"
      :header="retStatus.title" body="Body"
      btn1_text="Tutup"
      btn1_style="success"
      @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.message}}</h5>
              </span>
    </vue-simple-dialog>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTabProcessIconV0, createTabProcessTextV0} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import Vue2LeafletHeatmap from "../components/Vue2LeafletHeatmap";
  import {
    createTableAreaListHeader, createTableAreaListHeader2_V1, createTableAreaListHeader3_V1,
    createTableAreaListHeader_V1,
    createTableAreaListHeaderV0, createTableAvaHeaderV0
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    fillLeafletAreaVariable,
    getBoundaryData,
    createLeafletColormap,
    createLeafletAreaPolygon
  } from "../../libs/simpleLib";
  import {createAreaLeafletDemoData} from "../../libs/demo_data";

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "ProcessWizardStep1",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueLeafletMap,
      VueSimpleDialog,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip,
      Vue2LeafletHeatmap
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},

        tabIndex: 3,
        cur_tab: 0,

        map_var: {},
        map_polygon: [],

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableAreaListHeader_V1(),
        table_headers2: createTableAreaListHeader2_V1(),
        table_headers3: createTableAreaListHeader3_V1(),
        table_headers4: createTableAvaHeaderV0(),
        table_datas: [],
        selected_data: {},
        tmp_datas: [],
        markers_heatmap: [[9884923.000000, 542966.000000, 1.320830],[9884923.000000, 543176.526316, 7.227245],[9884923.000000, 543387.052632, 1.103535],[9884923.000000, 543597.578947, 1.174929],[9884923.000000, 543808.105263, 6.407179],[9884923.000000, 544018.631579, 3.288142],[9884923.000000, 544229.157895, 6.538120],[9884923.000000, 544439.684211, 7.491315],[9884923.000000, 544650.210526, 5.831857],[9884923.000000, 544860.736842, 7.400323],[9884923.000000, 545071.263158, 2.348269],[9884923.000000, 545281.789474, 7.349575],[9884923.000000, 545492.315789, 9.705985],[9884923.000000, 545702.842105, 8.669303],[9884923.000000, 545913.368421, 0.862345],[9884923.000000, 546123.894737, 3.664366],[9884923.000000, 546334.421053, 3.691988],[9884923.000000, 546544.947368, 6.850285],[9884923.000000, 546755.473684, 5.979416],[9884923.000000, 546966.000000, 7.893639],[9885449.315789, 542966.000000, 3.676529],[9885449.315789, 543176.526316, 2.060279],[9885449.315789, 543387.052632, 0.866665],[9885449.315789, 543597.578947, 7.719339],[9885449.315789, 543808.105263, 2.056745],[9885449.315789, 544018.631579, 3.882716],[9885449.315789, 544229.157895, 5.517785],[9885449.315789, 544439.684211, 2.289533],[9885449.315789, 544650.210526, 6.419406],[9885449.315789, 544860.736842, 4.844804],[9885449.315789, 545071.263158, 1.518455],[9885449.315789, 545281.789474, 7.819320],[9885449.315789, 545492.315789, 1.006063],[9885449.315789, 545702.842105, 2.940663],[9885449.315789, 545913.368421, 2.373730],[9885449.315789, 546123.894737, 5.308723],[9885449.315789, 546334.421053, 0.914987],[9885449.315789, 546544.947368, 4.053154],[9885449.315789, 546755.473684, 1.048462],[9885449.315789, 546966.000000, 1.122840],[9885975.631579, 542966.000000, 7.844279],[9885975.631579, 543176.526316, 2.915703],[9885975.631579, 543387.052632, 6.035334],[9885975.631579, 543597.578947, 9.644227],[9885975.631579, 543808.105263, 4.324850],[9885975.631579, 544018.631579, 6.947522],[9885975.631579, 544229.157895, 7.580993],[9885975.631579, 544439.684211, 4.326423],[9885975.631579, 544650.210526, 6.554980],[9885975.631579, 544860.736842, 1.097551],[9885975.631579, 545071.263158, 9.337598],[9885975.631579, 545281.789474, 1.874608],[9885975.631579, 545492.315789, 2.661788],[9885975.631579, 545702.842105, 7.978303],[9885975.631579, 545913.368421, 4.876038],[9885975.631579, 546123.894737, 7.689583],[9885975.631579, 546334.421053, 3.960067],[9885975.631579, 546544.947368, 2.729388],[9885975.631579, 546755.473684, 0.372346],[9885975.631579, 546966.000000, 6.732949],[9886501.947368, 542966.000000, 4.295645],[9886501.947368, 543176.526316, 4.517392],[9886501.947368, 543387.052632, 6.098572],[9886501.947368, 543597.578947, 0.594033],[9886501.947368, 543808.105263, 3.158114],[9886501.947368, 544018.631579, 7.727221],[9886501.947368, 544229.157895, 6.964330],[9886501.947368, 544439.684211, 1.253322],[9886501.947368, 544650.210526, 1.301515],[9886501.947368, 544860.736842, 0.923523],[9886501.947368, 545071.263158, 0.078203],[9886501.947368, 545281.789474, 4.231094],[9886501.947368, 545492.315789, 6.555732],[9886501.947368, 545702.842105, 7.229225],[9886501.947368, 545913.368421, 5.312093],[9886501.947368, 546123.894737, 1.088179],[9886501.947368, 546334.421053, 6.317664],[9886501.947368, 546544.947368, 1.264999],[9886501.947368, 546755.473684, 1.343033],[9886501.947368, 546966.000000, 0.985941],[9887028.263158, 542966.000000, 1.420272],[9887028.263158, 543176.526316, 1.682513],[9887028.263158, 543387.052632, 1.962489],[9887028.263158, 543597.578947, 3.174798],[9887028.263158, 543808.105263, 3.164290],[9887028.263158, 544018.631579, 2.175633],[9887028.263158, 544229.157895, 2.510418],[9887028.263158, 544439.684211, 8.929224],[9887028.263158, 544650.210526, 7.032232],[9887028.263158, 544860.736842, 5.557379],[9887028.263158, 545071.263158, 1.844337],[9887028.263158, 545281.789474, 2.120308],[9887028.263158, 545492.315789, 0.773468],[9887028.263158, 545702.842105, 9.138004],[9887028.263158, 545913.368421, 7.067152],[9887028.263158, 546123.894737, 5.577890],[9887028.263158, 546334.421053, 3.134290],[9887028.263158, 546544.947368, 1.662036],[9887028.263158, 546755.473684, 6.224973],[9887028.263158, 546966.000000, 9.879347],[9887554.578947, 542966.000000, 1.704320],[9887554.578947, 543176.526316, 2.577923],[9887554.578947, 543387.052632, 3.967993],[9887554.578947, 543597.578947, 0.739948],[9887554.578947, 543808.105263, 6.840961],[9887554.578947, 544018.631579, 4.023883],[9887554.578947, 544229.157895, 9.828352],[9887554.578947, 544439.684211, 4.021840],[9887554.578947, 544650.210526, 6.206719],[9887554.578947, 544860.736842, 1.543698],[9887554.578947, 545071.263158, 3.813452],[9887554.578947, 545281.789474, 1.611340],[9887554.578947, 545492.315789, 7.581124],[9887554.578947, 545702.842105, 8.711111],[9887554.578947, 545913.368421, 3.507767],[9887554.578947, 546123.894737, 6.855357],[9887554.578947, 546334.421053, 2.941486],[9887554.578947, 546544.947368, 5.306293],[9887554.578947, 546755.473684, 8.324234],[9887554.578947, 546966.000000, 5.974902],[9888080.894737, 542966.000000, 3.353113],[9888080.894737, 543176.526316, 2.992250],[9888080.894737, 543387.052632, 4.525925],[9888080.894737, 543597.578947, 4.226457],[9888080.894737, 543808.105263, 3.596063],[9888080.894737, 544018.631579, 5.583192],[9888080.894737, 544229.157895, 7.425454],[9888080.894737, 544439.684211, 4.243348],[9888080.894737, 544650.210526, 4.293558],[9888080.894737, 544860.736842, 1.248728],[9888080.894737, 545071.263158, 0.244340],[9888080.894737, 545281.789474, 2.901853],[9888080.894737, 545492.315789, 3.175206],[9888080.894737, 545702.842105, 6.536901],[9888080.894737, 545913.368421, 9.569359],[9888080.894737, 546123.894737, 9.357309],[9888080.894737, 546334.421053, 4.578863],[9888080.894737, 546544.947368, 2.404784],[9888080.894737, 546755.473684, 7.638979],[9888080.894737, 546966.000000, 7.593274],[9888607.210526, 542966.000000, 7.406481],[9888607.210526, 543176.526316, 7.436883],[9888607.210526, 543387.052632, 1.059204],[9888607.210526, 543597.578947, 6.815604],[9888607.210526, 543808.105263, 4.632606],[9888607.210526, 544018.631579, 2.121632],[9888607.210526, 544229.157895, 0.985187],[9888607.210526, 544439.684211, 8.235745],[9888607.210526, 544650.210526, 1.750097],[9888607.210526, 544860.736842, 1.635699],[9888607.210526, 545071.263158, 6.659872],[9888607.210526, 545281.789474, 8.943894],[9888607.210526, 545492.315789, 5.165582],[9888607.210526, 545702.842105, 7.027023],[9888607.210526, 545913.368421, 1.535904],[9888607.210526, 546123.894737, 9.534571],[9888607.210526, 546334.421053, 5.408841],[9888607.210526, 546544.947368, 6.797339],[9888607.210526, 546755.473684, 0.365630],[9888607.210526, 546966.000000, 8.092039],[9889133.526316, 542966.000000, 7.486189],[9889133.526316, 543176.526316, 1.201870],[9889133.526316, 543387.052632, 5.250452],[9889133.526316, 543597.578947, 3.258336],[9889133.526316, 543808.105263, 5.464494],[9889133.526316, 544018.631579, 3.988808],[9889133.526316, 544229.157895, 4.150934],[9889133.526316, 544439.684211, 1.807378],[9889133.526316, 544650.210526, 2.553867],[9889133.526316, 544860.736842, 0.205358],[9889133.526316, 545071.263158, 9.236756],[9889133.526316, 545281.789474, 6.536999],[9889133.526316, 545492.315789, 9.326136],[9889133.526316, 545702.842105, 1.635124],[9889133.526316, 545913.368421, 9.210973],[9889133.526316, 546123.894737, 7.946579],[9889133.526316, 546334.421053, 5.773942],[9889133.526316, 546544.947368, 4.400356],[9889133.526316, 546755.473684, 2.576137],[9889133.526316, 546966.000000, 7.519464],[9889659.842105, 542966.000000, 2.286695],[9889659.842105, 543176.526316, 0.641871],[9889659.842105, 543387.052632, 7.673295],[9889659.842105, 543597.578947, 6.712022],[9889659.842105, 543808.105263, 7.152125],[9889659.842105, 544018.631579, 6.420608],[9889659.842105, 544229.157895, 4.190483],[9889659.842105, 544439.684211, 3.907621],[9889659.842105, 544650.210526, 8.161401],[9889659.842105, 544860.736842, 3.174279],[9889659.842105, 545071.263158, 8.145398],[9889659.842105, 545281.789474, 7.890735],[9889659.842105, 545492.315789, 8.522639],[9889659.842105, 545702.842105, 5.056366],[9889659.842105, 545913.368421, 6.356614],[9889659.842105, 546123.894737, 9.508944],[9889659.842105, 546334.421053, 4.439642],[9889659.842105, 546544.947368, 0.600188],[9889659.842105, 546755.473684, 8.667499],[9889659.842105, 546966.000000, 6.311887],[9890186.157895, 542966.000000, 3.550737],[9890186.157895, 543176.526316, 9.970033],[9890186.157895, 543387.052632, 2.241715],[9890186.157895, 543597.578947, 6.524511],[9890186.157895, 543808.105263, 6.049906],[9890186.157895, 544018.631579, 3.872454],[9890186.157895, 544229.157895, 1.421872],[9890186.157895, 544439.684211, 0.251350],[9890186.157895, 544650.210526, 4.211123],[9890186.157895, 544860.736842, 1.841003],[9890186.157895, 545071.263158, 7.257753],[9890186.157895, 545281.789474, 3.703627],[9890186.157895, 545492.315789, 8.415601],[9890186.157895, 545702.842105, 7.342297],[9890186.157895, 545913.368421, 5.710259],[9890186.157895, 546123.894737, 1.768551],[9890186.157895, 546334.421053, 9.573840],[9890186.157895, 546544.947368, 2.653220],[9890186.157895, 546755.473684, 9.245809],[9890186.157895, 546966.000000, 2.237704],[9890712.473684, 542966.000000, 3.735638],[9890712.473684, 543176.526316, 0.875003],[9890712.473684, 543387.052632, 6.401165],[9890712.473684, 543597.578947, 1.806169],[9890712.473684, 543808.105263, 0.450511],[9890712.473684, 544018.631579, 7.231735],[9890712.473684, 544229.157895, 3.474376],[9890712.473684, 544439.684211, 6.606168],[9890712.473684, 544650.210526, 3.838686],[9890712.473684, 544860.736842, 6.273465],[9890712.473684, 545071.263158, 0.216498],[9890712.473684, 545281.789474, 9.105700],[9890712.473684, 545492.315789, 8.005587],[9890712.473684, 545702.842105, 7.458475],[9890712.473684, 545913.368421, 8.131128],[9890712.473684, 546123.894737, 3.833063],[9890712.473684, 546334.421053, 6.172792],[9890712.473684, 546544.947368, 5.754949],[9890712.473684, 546755.473684, 5.300517],[9890712.473684, 546966.000000, 2.750698],[9891238.789474, 542966.000000, 2.486290],[9891238.789474, 543176.526316, 4.516388],[9891238.789474, 543387.052632, 2.277128],[9891238.789474, 543597.578947, 8.044496],[9891238.789474, 543808.105263, 9.861042],[9891238.789474, 544018.631579, 0.299920],[9891238.789474, 544229.157895, 5.356642],[9891238.789474, 544439.684211, 0.870772],[9891238.789474, 544650.210526, 8.020914],[9891238.789474, 544860.736842, 9.891449],[9891238.789474, 545071.263158, 0.669463],[9891238.789474, 545281.789474, 9.393984],[9891238.789474, 545492.315789, 0.181775],[9891238.789474, 545702.842105, 6.838386],[9891238.789474, 545913.368421, 7.837365],[9891238.789474, 546123.894737, 5.341376],[9891238.789474, 546334.421053, 8.853595],[9891238.789474, 546544.947368, 8.990049],[9891238.789474, 546755.473684, 6.259376],[9891238.789474, 546966.000000, 1.378690],[9891765.105263, 542966.000000, 2.178016],[9891765.105263, 543176.526316, 1.821411],[9891765.105263, 543387.052632, 0.418199],[9891765.105263, 543597.578947, 1.069417],[9891765.105263, 543808.105263, 6.164435],[9891765.105263, 544018.631579, 9.396610],[9891765.105263, 544229.157895, 3.544557],[9891765.105263, 544439.684211, 4.106291],[9891765.105263, 544650.210526, 9.843494],[9891765.105263, 544860.736842, 9.455792],[9891765.105263, 545071.263158, 6.766447],[9891765.105263, 545281.789474, 9.883023],[9891765.105263, 545492.315789, 7.668314],[9891765.105263, 545702.842105, 3.366993],[9891765.105263, 545913.368421, 6.623819],[9891765.105263, 546123.894737, 2.441653],[9891765.105263, 546334.421053, 2.955073],[9891765.105263, 546544.947368, 6.801784],[9891765.105263, 546755.473684, 5.278468],[9891765.105263, 546966.000000, 4.115935],[9892291.421053, 542966.000000, 6.026382],[9892291.421053, 543176.526316, 7.505201],[9892291.421053, 543387.052632, 5.835332],[9892291.421053, 543597.578947, 5.517925],[9892291.421053, 543808.105263, 5.835706],[9892291.421053, 544018.631579, 5.118199],[9892291.421053, 544229.157895, 0.825927],[9892291.421053, 544439.684211, 7.195701],[9892291.421053, 544650.210526, 9.961561],[9892291.421053, 544860.736842, 3.545343],[9892291.421053, 545071.263158, 9.712588],[9892291.421053, 545281.789474, 3.464488],[9892291.421053, 545492.315789, 8.865439],[9892291.421053, 545702.842105, 4.546949],[9892291.421053, 545913.368421, 4.134273],[9892291.421053, 546123.894737, 2.177321],[9892291.421053, 546334.421053, 1.256546],[9892291.421053, 546544.947368, 3.089146],[9892291.421053, 546755.473684, 7.261044],[9892291.421053, 546966.000000, 7.828721],[9892817.736842, 542966.000000, 6.937876],[9892817.736842, 543176.526316, 0.098023],[9892817.736842, 543387.052632, 8.432133],[9892817.736842, 543597.578947, 9.223320],[9892817.736842, 543808.105263, 7.709542],[9892817.736842, 544018.631579, 0.426599],[9892817.736842, 544229.157895, 3.781861],[9892817.736842, 544439.684211, 7.043396],[9892817.736842, 544650.210526, 7.295130],[9892817.736842, 544860.736842, 2.242771],[9892817.736842, 545071.263158, 2.690547],[9892817.736842, 545281.789474, 6.730312],[9892817.736842, 545492.315789, 4.774922],[9892817.736842, 545702.842105, 6.237164],[9892817.736842, 545913.368421, 2.364449],[9892817.736842, 546123.894737, 1.771238],[9892817.736842, 546334.421053, 8.296434],[9892817.736842, 546544.947368, 7.669217],[9892817.736842, 546755.473684, 9.344783],[9892817.736842, 546966.000000, 1.078889],[9893344.052632, 542966.000000, 1.822275],[9893344.052632, 543176.526316, 0.990953],[9893344.052632, 543387.052632, 4.897638],[9893344.052632, 543597.578947, 1.932453],[9893344.052632, 543808.105263, 8.958916],[9893344.052632, 544018.631579, 0.990896],[9893344.052632, 544229.157895, 0.441656],[9893344.052632, 544439.684211, 5.572952],[9893344.052632, 544650.210526, 7.724951],[9893344.052632, 544860.736842, 3.119401],[9893344.052632, 545071.263158, 1.789825],[9893344.052632, 545281.789474, 3.389557],[9893344.052632, 545492.315789, 2.101456],[9893344.052632, 545702.842105, 5.101525],[9893344.052632, 545913.368421, 9.063643],[9893344.052632, 546123.894737, 6.289239],[9893344.052632, 546334.421053, 1.015339],[9893344.052632, 546544.947368, 3.908548],[9893344.052632, 546755.473684, 0.546166],[9893344.052632, 546966.000000, 5.012829],[9893870.368421, 542966.000000, 4.317212],[9893870.368421, 543176.526316, 9.975603],[9893870.368421, 543387.052632, 8.116026],[9893870.368421, 543597.578947, 4.856517],[9893870.368421, 543808.105263, 8.944478],[9893870.368421, 544018.631579, 1.375466],[9893870.368421, 544229.157895, 3.900049],[9893870.368421, 544439.684211, 9.273562],[9893870.368421, 544650.210526, 9.174938],[9893870.368421, 544860.736842, 7.135740],[9893870.368421, 545071.263158, 6.183374],[9893870.368421, 545281.789474, 3.432879],[9893870.368421, 545492.315789, 9.360273],[9893870.368421, 545702.842105, 1.247740],[9893870.368421, 545913.368421, 7.305854],[9893870.368421, 546123.894737, 6.464774],[9893870.368421, 546334.421053, 8.331520],[9893870.368421, 546544.947368, 3.982822],[9893870.368421, 546755.473684, 7.498222],[9893870.368421, 546966.000000, 8.352205],[9894396.684211, 542966.000000, 3.224604],[9894396.684211, 543176.526316, 5.522616],[9894396.684211, 543387.052632, 9.791291],[9894396.684211, 543597.578947, 5.493085],[9894396.684211, 543808.105263, 3.304236],[9894396.684211, 544018.631579, 6.194716],[9894396.684211, 544229.157895, 3.606366],[9894396.684211, 544439.684211, 7.565095],[9894396.684211, 544650.210526, 4.139007],[9894396.684211, 544860.736842, 4.923451],[9894396.684211, 545071.263158, 6.947432],[9894396.684211, 545281.789474, 9.727339],[9894396.684211, 545492.315789, 3.277550],[9894396.684211, 545702.842105, 8.378032],[9894396.684211, 545913.368421, 7.390722],[9894396.684211, 546123.894737, 9.541745],[9894396.684211, 546334.421053, 0.319226],[9894396.684211, 546544.947368, 3.568690],[9894396.684211, 546755.473684, 6.626538],[9894396.684211, 546966.000000, 2.815016],[9894923.000000, 542966.000000, 2.303831],[9894923.000000, 543176.526316, 7.111286],[9894923.000000, 543387.052632, 6.245729],[9894923.000000, 543597.578947, 5.906087],[9894923.000000, 543808.105263, 6.604380],[9894923.000000, 544018.631579, 0.475547],[9894923.000000, 544229.157895, 3.487848],[9894923.000000, 544439.684211, 4.513406],[9894923.000000, 544650.210526, 2.409050],[9894923.000000, 544860.736842, 7.150450],[9894923.000000, 545071.263158, 8.561823],[9894923.000000, 545281.789474, 2.815077],[9894923.000000, 545492.315789, 7.310508],[9894923.000000, 545702.842105, 1.377629],[9894923.000000, 545913.368421, 8.367228],[9894923.000000, 546123.894737, 1.386017],[9894923.000000, 546334.421053, 5.882094],[9894923.000000, 546544.947368, 3.661568],[9894923.000000, 546755.473684, 8.067595],[9894923.000000, 546966.000000, 5.037808],],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
      }
    },

    beforeMount: function () {
      this.getListArea();
    },

    methods: {
      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['bg-primary', 'text-light']
        } else {
          return ['bg-light', 'text-info']
        }
      },

      //MESSAGE HTTP I/O
      dialogMessageBtn1Click() {
        if (this.retStatus.status === -1) { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        } else { //error token
          this.$refs.dialogMessage.hideModal();
        }
      },

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      createStyleFromIndex(item) {
        let fg_color = item["poly"]["color"];
        if (item.plot === false)
          fg_color = "#696969";

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:150%;";
        return (strstyle);
      },
      eventSelectAreaClicked(idx) {
        let status = !this.table_datas[idx].plot;
        this.table_datas[idx].plot = status; // select/unselect

        this.map_polygon = [];
        for (let i = 0; i < this.table_datas.length; i++) {
          let item = this.table_datas[i];
          if (item.plot === true)
            this.map_polygon.push(item.poly);
        }
      },
      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_datas.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_datas.length);
        } catch (e) {
          return (0);
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      //-----------------------------------------------------
      openGeobodyPage(item) {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-0",
          // query: {mode:0}
        });
      },
      openXYZPage(item) {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-1",
          query: {mode: 1}
        });
      },

      getTabIcon() {
        return (createTabProcessIconV0(0))
      },
      getTabText() {
        return (createTabProcessTextV0(0))
      },
      wizardButtonClicked(str_router) {
        return (this.varRouter.getRoute(str_router, 1))
      },

      getListArea() {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedArea', {}); //set selected project
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_list]).then();
      },

      createDemoCss(cc) {
        return ('<span class="map-marker3" style="background-color:' + cc + '"/>');
      },
      createCustomMarkerPopup(item) {
        let sstr = 'Area : <b>' + item.area + '</b><br>';
        sstr = sstr + 'Lat : <b>' + item.lat + '</b><br>';
        sstr = sstr + 'Lon : <b>' + item.lon + '</b>';
        return (sstr);
      },
    },
    mounted() {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // // DO
      // this.$nextTick(() => {
      //   this.map = this.$refs.map.mapObject; // work as expected
      // });

      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.table_datas = msg.data; //fill table contents

        this.map_var = createAreaLeafletDemoData();
        for (let i = 0; i < this.table_datas.length; i++) {
          let item = this.table_datas[i];
          this.map_var = fillLeafletAreaVariable(this.map_var, item["coordinate"], i);
          item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
          item.plot = true;

          this.map_polygon.push(item.poly);
        }
        console.log(JSON.stringify(this.map_var));
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
