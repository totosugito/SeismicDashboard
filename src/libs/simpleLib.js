
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
  return(p);
}
