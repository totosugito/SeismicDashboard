import {getLocalMapServer} from "../_constant/http_api";

export function getSampleGeoJson() {
  let data = [
    {"type":"Feature","properties":{},
      "geometry":{"type":"Polygon",
        "coordinates":[[[547829.4524432644,9921902.680855785],[552717.8998333141,9918002.664901333],
          [548593.2723479569,9912802.64362873],[540420.3993677162,9914561.474353287],
          [539427.43349161,9917926.194000265],[542482.713110391,9920832.088240836],[547829.4524432644,9921902.680855785]]]}}];
  return(data);
}
export function createAreaDemoData() {
  let data = [{"id_area": 1, "name": "CT3D", "bin_area": 156.25,
    "coordinate": {"p1": {"x": 553903, "y": 9896783}, "p2": {"x": 564971.187300455, "y": 9894631.96359927}, "p3": {"x":
          574337.187300455, "y": 9942816.96359927}, "p4": {"x": 563269, "y": 9944968}}}, {"id_area": 2, "name": "TUNU95",
    "bin_area": 625, "coordinate": {"p1": {"x": 546966, "y": 9884923}, "p2": {"x": 573765.500059278, "y": 9911259.5086963},
      "p3": {"x": 555436.500059046, "y": 9929910.50869654}, "p4": {"x": 528636.999999768, "y": 9903574.00000024}}, "substack":
      {"near": {"filename": "TUNU95_substack_near.segy", "headerfile": "TUNU95_substack_near_hdr.csv", "loc":
            "TUNU95/substack"}, "mid": {"filename": "TUNU95_substack_mid.segy", "headerfile": "TUNU95_substack_mid_hdr.csv", "loc":
            "TUNU95/substack"}, "far": {"filename": "TUNU95_substack_far.segy", "headerfile": "TUNU95_substack_far_hdr.csv", "loc":
            "TUNU95/substack"}, "vfar": {"filename": "TUNU95_substack_vfar.segy", "headerfile": "TUNU95_substack_vfar_hdr.csv",
          "loc": "TUNU95/substack"}, "full": {"filename": "TUNU95_substack_full.segy", "headerfile":
            "TUNU95_substack_full_hdr.csv", "loc": "TUNU95/substack"}}, "gather_AVA": {"filename": "TUNU95_gather_AVA.segy",
      "headerfile": "TUNU95_gather_AVA_hdr.csv", "loc": "TUNU95/gather"}}];
  return (data);
}

export function addShowKeyToLayer(datas) {
  for(let i=0; i<datas.length; i++)
  {
    datas[i]["show"] = false;
  }
  return(datas);
}
export function createHeatmapDemoData() {
  let datas = [];
  return (datas);
}

export function createAvaDemoData() {
  let ava_data = [
    {
      "cdp_x": 563010,
      "cdp_y": 9899087,
      "cdp_z": 532.608,
      "iline": 5583,
      "xline": 2681,
      "label": "gth",
      "check": true
    },
    {
      "cdp_x": 563059,
      "cdp_y": 9899078,
      "cdp_z": 518.738,
      "iline": 5583,
      "xline": 2685,
      "label": "gth",
      "check": true
    },
    {
      "cdp_x": 562970,
      "cdp_y": 9899146,
      "cdp_z": 532.608,
      "iline": 5587,
      "xline": 2677,
      "label": "gth",
      "check": true
    },
    {
      "cdp_x": 563019,
      "cdp_y": 9899136,
      "cdp_z": 535.382,
      "iline": 5587,
      "xline": 2681,
      "label": "gth",
      "check": true
    },
    {
      "cdp_x": 563019,
      "cdp_y": 9899136,
      "cdp_z": 545.148,
      "iline": 5587,
      "xline": 2681,
      "label": "gth",
      "check": true
    },
    {
      "cdp_x": 563068,
      "cdp_y": 9899127,
      "cdp_z": 538.156,
      "iline": 5587,
      "xline": 2685,
      "label": "gth",
      "check": true
    }
  ];
  return (ava_data);
}

export function createProbDemoData() {
  let prob_data = {};
  return (prob_data);
}

export function createGeobodyDemoData() {
  let data = [];
  return (data);
}

// export function createAreaLeafletDemoData() {
//   let data = {
//     "zoom": 10,
//     "minZoom": 7,
//     "maxZoom": 16,
//     "mapMaxResolution": 2.38865713,
//     "url": getLocalMapServer() + "/{z}/{x}/{y}.png",
//     "attribution": '',
//     "tileExtent": [-20037508.34278924, -20037508.34278924, 20037508.34278924, 20037508.34278924],
//     "polygon": [],
//     "poly_color": []
//   };
//   return (data);
// }

export function createAreaLeafletDemoData() {
  let data = {
    "zoom": 11,
    "minZoom": 8,
    "maxZoom": 16,
    "mapMaxResolution": 2.38865713,
    "url": getLocalMapServer() + "/{z}/{x}/{y}.png",
    "attribution": '',
    "tileExtent": [-20037508.34278924, -20037508.34278924, 20037508.34278924, 20037508.34278924],
    "polygon": [],
    "poly_color": []
  };
  return (data);
}

export function createDemoAvaGeobodyParam() {
  let param = {
    "data": {
      "id_area": 1,
      "gather_file_name": "CT3D_gather_AVA",
      "substack_file_name": "CT3D_substack_far",
      "geobody_id": "220845",
      "rad_x": 50,
      "rad_y": 50,
      "rad_z": 15
    }
  };
  return (param);
}

export function createDemoAvaPointParam() {
  let param = {
    "data": {
      "id_area": 1,
      "gather_file_name": "10_TUN_CT3DTZ_19_KPSTM_GTHR_D_FINAL_ANGLE_SCALED_Big_Endian.segy",
      "substack_file_name": "10_TUN_CT3DTZ_19_KPSTM_FAR_D_ELNWG_ZEROPHASED_Scaled.segy",
      "type": "ilxl",
      "cdp_z": 500,
      "rad_x": 100,
      "rad_y": 50,
      "rad_z": 15,
      "iline": 5583,
      "xline": 2685
    }
  };
  return (param);
}

export function createDemoProbParam() {
  let param = {
    "data": {
      "id_area": 1,
      "mlmodel_label_name": "CT3D_v30_m01_sm30_05_auc_0885",
      "data": [
        {
          "iline": 5579.0,
          "xline": 2681.0,
          "cdp_x": 563000.0,
          "cdp_y": 9899038.0,
          "cdp_z": 484.576
        },
        {
          "iline": 5579.0,
          "xline": 2681.0,
          "cdp_x": 563000.0,
          "cdp_y": 9899038.0,
          "cdp_z": 487.764
        }
      ]
    }
  };
  return (param);
}

export function createDemoWellInRadius() {
  let data = [
    {
      "well_id": "TN-G23",
      "xmd": 560418.12,
      "ymd": 9910771.48,
      "zmd": 812.83,
      "xst": 560813.97,
      "yst": 9910918.69,
      "zst": 134.1,
      "xen": 560022.27,
      "yen": 9910624.27,
      "zen": 1491.56
    },
    {
      "well_id": "TN-G50",
      "xmd": 562118.46,
      "ymd": 9913680.72,
      "zmd": 628.47,
      "xst": 562498.4,
      "yst": 9913335.64,
      "zst": 135.51,
      "xen": 561738.51,
      "yen": 9914025.81,
      "zen": 1121.43
    },
    {
      "well_id": "TN-G51",
      "xmd": 561044.92,
      "ymd": 9911022.95,
      "zmd": 757.07,
      "xst": 560873.82,
      "yst": 9910899.54,
      "zst": 115.85,
      "xen": 561216.02,
      "yen": 9911146.36,
      "zen": 1398.29
    },
    {
      "well_id": "TN-G52",
      "xmd": 560309.27,
      "ymd": 9911044.27,
      "zmd": 824.97,
      "xst": 560840.26,
      "yst": 9910914.97,
      "zst": 124.74,
      "xen": 559778.28,
      "yen": 9911173.57,
      "zen": 1525.2
    },
    {
      "well_id": "TN-G66",
      "xmd": 562274.13,
      "ymd": 9913616.3,
      "zmd": 732.79,
      "xst": 562491.25,
      "yst": 9913350.38,
      "zst": 128.38,
      "xen": 562057.01,
      "yen": 9913882.21,
      "zen": 1337.21
    },
    {
      "well_id": "TN-G68",
      "xmd": 563719.24,
      "ymd": 9912556.16,
      "zmd": 787.17,
      "xst": 564256.22,
      "yst": 9913056.62,
      "zst": 124.39,
      "xen": 563182.27,
      "yen": 9912055.69,
      "zen": 1449.95
    },
    {
      "well_id": "TN-G70",
      "xmd": 564259.93,
      "ymd": 9913182.4,
      "zmd": 374.31,
      "xst": 564266.37,
      "yst": 9913068.45,
      "zst": 144.1,
      "xen": 564253.5,
      "yen": 9913296.35,
      "zen": 604.53
    },
    {
      "well_id": "TN-G71",
      "xmd": 562101.42,
      "ymd": 9912894.4,
      "zmd": 681.45,
      "xst": 562255.05,
      "yst": 9913036.34,
      "zst": 120.88,
      "xen": 561947.79,
      "yen": 9912752.46,
      "zen": 1242.02
    },
    {
      "well_id": "TN-G72",
      "xmd": 564756.72,
      "ymd": 9913342.98,
      "zmd": 701.39,
      "xst": 564271.93,
      "yst": 9913059.04,
      "zst": 126.07,
      "xen": 565241.51,
      "yen": 9913626.92,
      "zen": 1276.71
    },
    {
      "well_id": "TN-G81",
      "xmd": 564621.72,
      "ymd": 9910047.38,
      "zmd": 527.28,
      "xst": 564694.3,
      "yst": 9910325.32,
      "zst": 122.24,
      "xen": 564549.14,
      "yen": 9909769.44,
      "zen": 932.33
    },
    {
      "well_id": "TN-G83",
      "xmd": 564875.23,
      "ymd": 9910643.5,
      "zmd": 676.49,
      "xst": 564700.9,
      "yst": 9910341.82,
      "zst": 127.83,
      "xen": 565049.56,
      "yen": 9910945.17,
      "zen": 1225.14
    },
    {
      "well_id": "TN-G87",
      "xmd": 561479.92,
      "ymd": 9913846.4,
      "zmd": 700.6,
      "xst": 561380.96,
      "yst": 9913264.75,
      "zst": 118.46,
      "xen": 561578.88,
      "yen": 9914428.06,
      "zen": 1282.74
    },
    {
      "well_id": "TN-G88",
      "xmd": 562283.84,
      "ymd": 9912700.76,
      "zmd": 598.82,
      "xst": 562261.16,
      "yst": 9913021.74,
      "zst": 185.08,
      "xen": 562306.53,
      "yen": 9912379.78,
      "zen": 1012.57
    },
    {
      "well_id": "TN-G91",
      "xmd": 559648.0,
      "ymd": 9913241.78,
      "zmd": 652.12,
      "xst": 559597.85,
      "yst": 9913770.89,
      "zst": 121.86,
      "xen": 559698.16,
      "yen": 9912712.67,
      "zen": 1182.39
    },
    {
      "well_id": "TN-Gx60",
      "xmd": 561723.68,
      "ymd": 9913263.48,
      "zmd": 784.18,
      "xst": 561743.11,
      "yst": 9913053.95,
      "zst": 116.89,
      "xen": 561704.25,
      "yen": 9913473.01,
      "zen": 1451.47
    },
    {
      "well_id": "TN-Gx62",
      "xmd": 561640.92,
      "ymd": 9913301.21,
      "zmd": 776.02,
      "xst": 561657.25,
      "yst": 9913063.59,
      "zst": 135.1,
      "xen": 561624.59,
      "yen": 9913538.83,
      "zen": 1416.95
    },
    {
      "well_id": "TN-Gx63",
      "xmd": 560916.85,
      "ymd": 9913106.19,
      "zmd": 724.16,
      "xst": 560759.22,
      "yst": 9912623.87,
      "zst": 117.76,
      "xen": 561074.49,
      "yen": 9913588.51,
      "zen": 1330.56
    },
    {
      "well_id": "TN-Gx65",
      "xmd": 560908.6,
      "ymd": 9912458.4,
      "zmd": 727.6,
      "xst": 560761.16,
      "yst": 9912612.78,
      "zst": 121.91,
      "xen": 561056.03,
      "yen": 9912304.01,
      "zen": 1333.28
    },
    {
      "well_id": "TN-Gx73",
      "xmd": 560443.42,
      "ymd": 9912270.0,
      "zmd": 697.89,
      "xst": 560801.9,
      "yst": 9912594.39,
      "zst": 120.52,
      "xen": 560084.94,
      "yen": 9911945.62,
      "zen": 1275.26
    },
    {
      "well_id": "TN-S149",
      "xmd": 558826.82,
      "ymd": 9902668.84,
      "zmd": 631.89,
      "xst": 558760.2,
      "yst": 9902870.68,
      "zst": 118.15,
      "xen": 558893.43,
      "yen": 9902467.01,
      "zen": 1145.63
    },
    {
      "well_id": "TN-S150",
      "xmd": 558556.33,
      "ymd": 9902763.51,
      "zmd": 616.5,
      "xst": 558745.54,
      "yst": 9902880.7,
      "zst": 116.74,
      "xen": 558367.12,
      "yen": 9902646.33,
      "zen": 1116.25
    },
    {
      "well_id": "TN-S151",
      "xmd": 558777.22,
      "ymd": 9904783.23,
      "zmd": 757.38,
      "xst": 558966.91,
      "yst": 9904783.49,
      "zst": 500.03,
      "xen": 558587.53,
      "yen": 9904782.98,
      "zen": 1014.74
    },
    {
      "well_id": "TN-S152",
      "xmd": 559526.06,
      "ymd": 9905053.82,
      "zmd": 772.08,
      "xst": 559159.69,
      "yst": 9904783.3,
      "zst": 117.99,
      "xen": 559892.43,
      "yen": 9905324.35,
      "zen": 1426.17
    },
    {
      "well_id": "TN-S156",
      "xmd": 559981.29,
      "ymd": 9903227.49,
      "zmd": 578.02,
      "xst": 559876.18,
      "yst": 9903425.67,
      "zst": 127.64,
      "xen": 560086.39,
      "yen": 9903029.32,
      "zen": 1028.4
    },
    {
      "well_id": "TN-S157",
      "xmd": 558716.92,
      "ymd": 9904513.17,
      "zmd": 722.63,
      "xst": 559147.51,
      "yst": 9904778.64,
      "zst": 118.94,
      "xen": 558286.33,
      "yen": 9904247.7,
      "zen": 1326.33
    },
    {
      "well_id": "TN-S158",
      "xmd": 560041.53,
      "ymd": 9903603.28,
      "zmd": 789.18,
      "xst": 559872.95,
      "yst": 9903441.1,
      "zst": 122.82,
      "xen": 560210.11,
      "yen": 9903765.47,
      "zen": 1455.54
    },
    {
      "well_id": "TN-S159",
      "xmd": 559844.73,
      "ymd": 9903748.25,
      "zmd": 625.53,
      "xst": 559864.51,
      "yst": 9903441.0,
      "zst": 116.29,
      "xen": 559824.95,
      "yen": 9904055.49,
      "zen": 1134.77
    },
    {
      "well_id": "TN-S160",
      "xmd": 559770.08,
      "ymd": 9908643.13,
      "zmd": 919.18,
      "xst": 559705.35,
      "yst": 9908499.4,
      "zst": 505.29,
      "xen": 559834.81,
      "yen": 9908786.86,
      "zen": 1333.07
    },
    {
      "well_id": "TN-S161",
      "xmd": 559207.83,
      "ymd": 9908362.18,
      "zmd": 894.28,
      "xst": 559579.33,
      "yst": 9908348.59,
      "zst": 506.14,
      "xen": 558836.33,
      "yen": 9908375.77,
      "zen": 1282.42
    },
    {
      "well_id": "TN-S162",
      "xmd": 559540.66,
      "ymd": 9907963.82,
      "zmd": 571.09,
      "xst": 559625.92,
      "yst": 9908329.47,
      "zst": 141.01,
      "xen": 559455.41,
      "yen": 9907598.16,
      "zen": 1001.17
    }
  ];
  return (data);
}

export function createDemoGeobodySectionList() {
  let data = [
    {
      "iline": 6206,
      "num.trace": 2
    },
    {
      "iline": 6207,
      "num.trace": 8
    },
    {
      "iline": 6208,
      "num.trace": 13
    },
    {
      "iline": 6209,
      "num.trace": 18
    },
    {
      "iline": 6210,
      "num.trace": 24
    },
    {
      "iline": 6211,
      "num.trace": 29
    },
    {
      "iline": 6212,
      "num.trace": 35
    },
    {
      "iline": 6213,
      "num.trace": 40
    },
    {
      "iline": 6214,
      "num.trace": 45
    },
    {
      "iline": 6215,
      "num.trace": 50
    },
    {
      "iline": 6216,
      "num.trace": 53
    },
    {
      "iline": 6217,
      "num.trace": 53
    },
    {
      "iline": 6218,
      "num.trace": 53
    },
    {
      "iline": 6219,
      "num.trace": 53
    },
    {
      "iline": 6220,
      "num.trace": 53
    },
    {
      "xline": 2203,
      "num.trace": 55
    },
    {
      "xline": 2204,
      "num.trace": 55
    },
    {
      "xline": 2205,
      "num.trace": 55
    },
    {
      "xline": 2206,
      "num.trace": 55
    },
    {
      "xline": 2207,
      "num.trace": 55
    },
    {
      "xline": 2208,
      "num.trace": 55
    },
    {
      "xline": 2209,
      "num.trace": 55
    },
    {
      "xline": 2210,
      "num.trace": 55
    }
  ];
  return (data);
}

export function createDemoProposeProspect()
{
  let data = {
    "id_area": 2,
    "layer": 2,
    "exca": {
      "iline": {
        "min": 1762,
        "max": 1908
      },
      "xline": {
        "min": 3677,
        "max": 3819
      },
      "z": {
        "min": 943.2111436950153,
        "max": 1017.387096774194
      }
    },
    "boxa": {
      "p1": {
        "iline": 1762,
        "xline": 3677,
        "x": 547906.3,
        "y": 9907613.58
      },
      "p2": {
        "iline": 1762,
        "xline": 3819,
        "x": 545418.07,
        "y": 9910145.62
      },
      "p3": {
        "iline": 1908,
        "xline": 3677,
        "x": 550509.66,
        "y": 9910171.9
      },
      "p4": {
        "iline": 1908,
        "xline": 3819,
        "x": 548021.43,
        "y": 9912703.94
      }
    }
  };
  return(data);
}

export function createDemoProspectProjectList()
{
  let data = [];
  return(data);
}
