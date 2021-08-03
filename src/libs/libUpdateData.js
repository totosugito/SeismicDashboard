import {createLeafletAreaPolygon, fillLeafletAreaVariable} from "./simpleLib";


export function addPlotDataToTableArea(map_var, datas)
{
  for (let i = 0; i < datas.length; i++)
  {
    let item = datas[i];
    map_var = fillLeafletAreaVariable(map_var, item["coordinate"], i);
    item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
    item.area_show = false;
    item.heatmap_available = false;
    item.heatmap_show = false;
    item.heatmap_data = [];
  }
  return(datas);
}

export function getAreaFirstCoordinate(datas)
{
  let coord = {
    lat: datas[0]["coordinate"]["p1"]["y"],
    lng: datas[0]["coordinate"]["p1"]["x"]};
  return(coord);
}

export function createTableFromHeatmapFullData(datas) {
  let r = [];
  let n = datas.length;

  let tmp =["Prob 500 - 600", "Prob 600 - 700", "Prob 700 - 800", "Prob 800 - 900", "Prob 900 - 1000"];
  for(let i=0; i<n; i++)
  {
    let x = {
      "name": tmp[i],
      "min": datas[i]["sum"]["min"],
      "max": datas[i]["sum"]["max"],
      "show_layer": false,
    };
    r.push(x);
  }
  return(r);
}

export function getMaxHeatmapData(datas) {
  let n = datas.length;
  let r = {min:0, max:0};

  if(n<=0)
    return(r);
  let max_data = datas[0]["max"];
  for(let i=0; i<n; i++)
  {
    if(max_data < datas[i]["max"])
      max_data = datas[i]["max"];
  }
  r["max"] = max_data;
  return (r);
}

export function createDefaultSectionAreaParameter() {
  let param = [
    {
      title: "InLine",
      min: 1,
      max: 3201,
      step: 1,
      vmin: 20,
      vmax: 80
    },
    {
      title: "XLine",
      min: 1,
      max: 100,
      step: 1,
      vmin: 20,
      vmax: 80
    },
    {
      title: "Depth",
      min: 1,
      max: 400,
      step: 1,
      vmin: 20,
      vmax: 80
    }
  ];
  return(param);
}
