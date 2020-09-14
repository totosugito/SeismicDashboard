
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

export function getMapServer()
{
  return ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
}

export function getMarkerColor(item, statusSetting)
{
  let idx = item.state;
  let n = statusSetting['marker_color'].length;
  if(idx>=n)
    return (statusSetting['marker_color'][n-1])
  return(statusSetting['marker_color'][idx]);
}
