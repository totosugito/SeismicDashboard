


export function matrix_col_optimum(nrow, ncol, mode, mat) {
	let ret = [];

	// minimum
	for (let icol = 0; icol < ncol; icol++ )
	{
		let v_op = mat[0][icol];
		for (let irow = 0; irow < nrow; irow++)
		{
			let v = mat[irow][icol];
			if (mode === 'min' && v_op > v)
				v_op = v;
			if (mode === 'max' && v_op < v)
				v_op = v;
			if (mode === 'opt' && Math.abs(v_op) < Math.abs(v))
				v_op = v;

		}
		ret[icol] = v_op
	}

	return ret
}

export function matrix_col_optimum_v1(nrow, ncol, mode, mat, row_start, xx, dy, ny)
{
  let ret = [];

  let series_info = [];

  // minimum
  let iy, vx, vy;
  iy = 0;
  for (let icol = 0; icol < ncol; icol++ )
  {
    vx = xx[icol];

    let v_op = mat[0][icol];
    for (let irow = 0; irow < nrow; irow++)
    {
      let v = mat[irow][icol];
      if(irow === 0) // init value
        iy = row_start + irow;

      if (mode === 'min' && v_op > v)
      {
        v_op = v;
        iy = row_start + irow;
      }
      if (mode === 'max' && v_op < v)
      {
        v_op = v;
        iy = row_start + irow;
      }
      if (mode === 'opt' && Math.abs(v_op) < Math.abs(v))
      {
        v_op = v;
        iy = row_start + irow;
      }
    }

    ret[icol] = v_op;
    vy = (ny-iy+1) * dy; //posisi y dibalik
    series_info.push({x: vx, y:vy})
  }

  return ({opt: ret, info: series_info});
}
