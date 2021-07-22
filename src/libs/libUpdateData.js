import {createLeafletAreaPolygon, fillLeafletAreaVariable} from "./simpleLib";


export function addPlotDataToTableArea(map_var, datas)
{
  let list_area_polygon = [];
  for (let i = 0; i < datas.length; i++)
  {
    let item = datas[i];
    map_var = fillLeafletAreaVariable(map_var, item["coordinate"], i);
    item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
    item.plot = true;
    list_area_polygon.push(item.poly);
  }
  return(list_area_polygon);
}

export function getAreaFirstCoordinate(datas)
{
  let coord = {
    lat: datas[0]["coordinate"]["p1"]["y"],
    lng: datas[0]["coordinate"]["p1"]["x"]};
  return(coord);
}
