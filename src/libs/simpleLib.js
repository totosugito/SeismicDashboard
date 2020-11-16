
export function getIndexFromArray(x, dx)
{
  let p = Math.round(x/dx);
  return(p)
}

export function getIndexFromArray3(x, dx, dstart)
{
  let p = Math.round((x - dstart)/dx);
  return(p)
}

export function setPositionFromIndex(idx, dx, dstart)
{
  let p = dstart + (idx*dx);
  return(p.toFixed(3));
}

export function getPinMarker()
{
  return("https://storage.googleapis.com/public-datas/pin_location.png");
}

export function getMapServer(imode)
{
  if(imode===0)
    return ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  else
    return('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
}

export function getMarkerColor(item, statusSetting)
{
  let idx = item.state;
  let n = statusSetting['marker_color'].length;
  if(idx>=n)
    return (statusSetting['marker_color'][n-1])
  return(statusSetting['marker_color'][idx]);
}

export function getBoundaryData(x, y, max_perc)
{
  // x coord
  let xmin = Math.min.apply(null, x);
  let xmax = Math.max.apply(null, x);
  let dx = Math.abs(xmax-xmin);

  // y coord
  let ymin = Math.min.apply(null, y);
  let ymax = Math.max.apply(null, y);
  let dy = Math.abs(ymax-ymin);

  let XL = 0.0;
  let XR = 0.0;
  let YB = 0.0;
  let YU = 0.0;
  if (dx>dy)
  {
    let ddx = dx * max_perc;
    XL = xmin - ddx;
    XR = xmax + ddx;

    let ddy = ((dx + (ddx*2.0)) - dy) / 2;
    YB = ymin - ddy;
    YU = ymax + ddy;
  }
  else
  {
    let ddy = dy * max_perc;
    YB = ymin - ddy;
    YU = ymax + ddy;

    let ddx = ((dy + (ddy*2.0)) - dx) / 2;
    XL = xmin - ddx;
    XR = xmax + ddx;
  }
  // console.log(XR-XL)
  // console.log(YU - YB)
  return([XL, XR, YB, YU]);
}

export function getJsonPythonId(obj) {
  return(obj["_id"]["$oid"])
}

export function rgbToHex1(r, g, b)
{
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHex2(color_)
{
  let r = Math.round(color_[0]*255);
  let g = Math.round(color_[1]*255);
  let b = Math.round(color_[2]*255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHexColormap(rgb_) {
  let hex_cm = [];
  for(let i=0; i<rgb_.length; i++)
  {
    hex_cm.push(rgbToHex2(rgb_[i]));
  }
  return(hex_cm);
}

export function getColormapColorv1(colormap_, cm_val) {
  //input hex colormap
  let n_cm = colormap_.length;
  let d_cm = 1.0 / n_cm;
  let idx_cm = Math.fround(cm_val/d_cm);
  if(idx_cm<0)
    idx_cm = 0;
  else if(idx_cm>=n_cm)
    idx_cm = n_cm-1;
  return(colormap_[idx_cm]);
}

export function getColormapColorv2(colormap_, cm_val, b_reverse) {
  //input rgb colormap
  let n_cm = colormap_.length;
  let d_cm = 1.0 / n_cm;
  let idx_cm = Math.round(cm_val/d_cm);
  if(idx_cm<0)
    idx_cm = 0;
  else if(idx_cm>=n_cm)
    idx_cm = n_cm-1;
  if(b_reverse === true)
    return(rgbToHex2(colormap_[255-idx_cm]));
  else
    return(rgbToHex2(colormap_[idx_cm]));
}
