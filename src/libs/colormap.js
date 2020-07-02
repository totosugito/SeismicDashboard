import {ColorRGBA, LUT} from "@arction/lcjs";
import {colormapOdtPetrel, colormapOdtSeismic, colormapSharp, colormapYrwbc} from "./var_colormaps";

export function createColormapData(color_list, vmin_, vmax_)
{


  let ndata_range = 256;
  let data_range = vmax_ - vmin_;
  let delta_data_range = data_range / ndata_range;

  let vcolormap = [];
  for (let i = 0; i < ndata_range; i++)
  {
    let V = delta_data_range * i + vmin_;
    let R = ~~(color_list[i][0] * 255);
    let G = ~~(color_list[i][1] * 255);
    let B = ~~(color_list[i][2] * 255);
    let v = {
      value: V,
      color: ColorRGBA(R, G, B)
    };
    vcolormap.push(v);
  }
  return (vcolormap);
}

export function get2dRowSize(data)
{
  if(data === undefined)
    return (0);
  return (data.length);
}

export function get2dColSize(data)
{
  if(data === undefined)
    return (0);
  return (data[0].length);
}

export function get2dMinData(data)
{
  if(data === undefined)
    return (0);

  let minRow = data.map(function (row)
  {
    return Math.min.apply(Math, row);
  });
  let mmin = Math.min.apply(null, minRow);
  return (mmin);
}

export function get2dMaxData(data)
{
  if(data === undefined)
    return (0);

  let maxRow = data.map(function (row)
  {
    return Math.max.apply(Math, row);
  });
  let mmax = Math.max.apply(null, maxRow);
  return (mmax);
}

export function getLcColormap(ii, mmin_, mmax_)
{
  let palette = {};
  switch (ii)
  {
    case 0:
      palette = new LUT({
        steps: createColormapData(colormapSharp(), mmin_, mmax_),
        interpolate: true
      });
      break;
    case 1:
      palette = new LUT({
        steps: createColormapData(colormapYrwbc(), mmin_, mmax_),
        interpolate: true
      });
      break;
    case 2:
      palette = new LUT({
        steps: createColormapData(colormapOdtSeismic(), mmin_, mmax_),
        interpolate: true
      });
      break;
    default:
      palette = new LUT({
        steps: createColormapData(colormapOdtPetrel(), mmin_, mmax_),
        interpolate: true
      });
      break;
  }
  return(palette);
}
