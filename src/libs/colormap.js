import {ColorRGBA, LUT} from "@arction/lcjs";
import {colormapGray, colormapOdtPetrel, colormapOdtSeismic, colormapSharp, colormapYrwbc} from "./var_colormaps";
import _ from "lodash";

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

export function getLcColormap(colormap, mmin_, mmax_)
{
  let palette = {};
  let cc = [];
  switch (colormap.id)
  {
    case 0:
      cc = colormapSharp();
      break;
    case 1:
      cc = colormapYrwbc();
      break;
    case 2:
      cc = colormapOdtSeismic();
      break;
    case 3:
      cc = colormapOdtPetrel();
      break;
    case 4:
      cc = colormapGray();
      break;
    default:
      cc = colormapOdtPetrel();
      break;
  }
  if (colormap.reverse)
    _.reverse(cc);

  palette = new LUT({
    steps: createColormapData(cc, mmin_, mmax_),
    interpolate: true
  });
  return (palette);
}

export function getColormapName(ii)
{
  switch (ii)
  {
    case 0:
      return('Sharp');
    case 1:
      return('YRWBC');
    case 2:
      return('Seismic');
    case 3:
      return('Petrel');
    case 4:
      return('Gray');
    default:
      return ('Petrel');
  }
}

export function getColormapAsset(ii)
{
  switch (ii)
  {
    case 0:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAABlElEQVR4nO3V22qDQBRA0aP+/yfH6UMp5KGFpmkuG9YCyWECjiPI3tZl1qyZOWdmfXPdsn7PPX6aH7nnK855z3tZMzPbzH7MbPvndT1vf1z/j3v8dn1/1J7H48+53/6Ma7ZZa5vznLlcZs5znjr/5v9n7/mKc94yf31mc8zMfvX7zPkd9zze75z7AECQgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJH0Ae+JIl9UOpkAAAAAASUVORK5CYII=');
    case 1:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAABgklEQVR4nO3V0UqFUBBA0VH//4tD7aGCXoIK8bphLTg4IDicB9nL+TbnHDOzz8zxef47X/ENO3/eec7MLDPbNrOuH+eK+ervvWLntj3ynueyzHkucxwz+z5zHHPr/Jv3d+98xT3/Mn/9ZrPNzPrteef8xJ3b8+65DgAECRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQNI7pZtIl7iDnMMAAAAASUVORK5CYII=');
    case 2:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAACc0lEQVR4nO3VTW7bSBSF0VtsOUHQ+19FrzFVPdAfRdF2gIwucA4gmH4qVpEe+Bv/JWuMZEsykozx+tkOv2ck2/a+boxkHOfb+frc996e12f75OTMfLHHn6wfJ+s/O/N0NvL4Y/3N+v38uMdxtp/vZ1+tP555fJbP9ni5/2z+yR7fzrdc/c0eY0vGv7fPr+tn+5nkZ9b4kYyP2+dHst2ucznMLkkuWeN2/bjn8vh9jUuSj2S7rctz3RqX6/f7dbf71312v85H5rhkrn+y1spaK3Pm9nM9Zmtl9/35d3PO5/XuuzlX1h+uf9l37s+cr/eerT8843O+3udzZb48x9ke8212fO7TvfPJ/JvZt2ce9s3K4dk/W//+ntmvXed7rDmzcvae1/V5e8/53De7PY6z/fwxm7szD8+Y3Zln++d6//OdTt4z9zN3+3+xR/Zn5vXseXLWfe28nXH9+Ttz/n78WwGAKgIGQCUBA6CSgAFQScAAqCRgAFQSMAAqCRgAlQQMgEoCBkAlAQOgkoABUEnAAKgkYABUEjAAKgkYAJUEDIBKAgZAJQEDoJKAAVBJwACoJGAAVBIwACoJGACVBAyASgIGQCUBA6CSgAFQScAAqCRgAFQSMAAqCRgAlQQMgEoCBkAlAQOgkoABUEnAAKgkYABUEjAAKgkYAJUEDIBKAgZAJQEDoJKAAVBJwACoJGAAVBIwACoJGACVBAyASgIGQCUBA6CSgAFQScAAqCRgAFQSMAAqCRgAlQQMgEoCBkAlAQOgkoABUEnAAKgkYABUEjAAKgkYAJUEDIBKAgZAJQEDoJKAAVBJwACoJGAAVBIwACr9DxWKX7lFww/QAAAAAElFTkSuQmCC');
    case 3:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAACy0lEQVR4nO3VUc7cKgwGUMPsfw93m5UafB9CCMlMF2DpHCmC2A5/H4Z+7b8/I/PIGMeIOCLyb0YeEXlkxJExjlz7PGZvZOQx5nue3121kXN/1mKenSMjRtz9az7vuRwZmfc5MeJ8X9+MiPkeGauWq7b3znpkPtZrLh69bT7i1RtnPzPm5nHmmo9XLZ7zZ2WrXTOv+fZVe6/nvu21Fl+11q791mtX7zXfYs2vXrv22/lfvVetb/t97rWeT9tq7a739jq/bfUWrT/P6Fd9/tFrrvdY9evM3nv0dcbd670/zrrXPvvX7Pn9Pd+j799/+qz1VWstInJEjmN7Roy5Puprbq55RIwRmef8ec49s97Xus/Mft5zcd2VWTufXGec87l6677lmL/Ve/78jY4fd2Wu8a7tv/2tHq9ejsed2tf2vj/Xv2H9lq+5eHz7uBevu9S22nPueY/2ma9a+zG/rY/9j9o9d/2u37V87K/72ntE/Oj1ntvcda/yfNp2bt978y6u2vb84z0+93ufvegR7fOcj2u/1z/PM6JH9M/zjHX+to/PfJ/1+V8OANQiwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAl/Q9hfuWSNOOtpwAAAABJRU5ErkJggg==');
    case 4:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAABQ0lEQVR4nO3VMQrEQAwEQfn+/+aVP3CB7ayhKllYBBP2dc7Z3Z3dnZn5+z79e3tv06ZNmzZtfr3/DQAECRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQNINKZD4sD4uX3cAAAAASUVORK5CYII=');
    default:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAACy0lEQVR4nO3VUc7cKgwGUMPsfw93m5UafB9CCMlMF2DpHCmC2A5/H4Z+7b8/I/PIGMeIOCLyb0YeEXlkxJExjlz7PGZvZOQx5nue3121kXN/1mKenSMjRtz9az7vuRwZmfc5MeJ8X9+MiPkeGauWq7b3znpkPtZrLh69bT7i1RtnPzPm5nHmmo9XLZ7zZ2WrXTOv+fZVe6/nvu21Fl+11q791mtX7zXfYs2vXrv22/lfvVetb/t97rWeT9tq7a739jq/bfUWrT/P6Fd9/tFrrvdY9evM3nv0dcbd670/zrrXPvvX7Pn9Pd+j799/+qz1VWstInJEjmN7Roy5Puprbq55RIwRmef8ec49s97Xus/Mft5zcd2VWTufXGec87l6677lmL/Ve/78jY4fd2Wu8a7tv/2tHq9ejsed2tf2vj/Xv2H9lq+5eHz7uBevu9S22nPueY/2ma9a+zG/rY/9j9o9d/2u37V87K/72ntE/Oj1ntvcda/yfNp2bt978y6u2vb84z0+93ufvegR7fOcj2u/1z/PM6JH9M/zjHX+to/PfJ/1+V8OANQiwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAl/Q9hfuWSNOOtpwAAAABJRU5ErkJggg==');
  }
}
