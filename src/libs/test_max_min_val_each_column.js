


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

//
// var matrix =
// [
// 	[0,  1203,  1406,  1524,  1451, 1348, 1228, 1110, 1021, 1053, 908, 417, -92, -445, -860, -1022, -1033],
// 	[0,   831,   948,   962,   972,  916,  853,  853,  875,  962, 906, 465, -38, -351, -712,  -923,  -991],
// 	[0,   309,   340,   295,   398,  407,  459,  572,  686,  772, 777, 407, -26, -258, -548,  -797,  -918],
// 	[0,  -170,  -183,  -245,  -107,  -58,   34,  245,  403,  473, 541, 270, -38, -176, -417,  -684,  -837],
// 	[0,  -482,  -498,  -575,  -484, -445, -357, -159,   -5,   65, 221,  98, -41,  -90, -312,  -584,  -751],
// ]
//
// console.log(matrix)
//
// // console.log(matrix[0][0])
// console.log('min', matrix_col_optimum(5, 17, 'min', matrix))
// console.log('max', matrix_col_optimum(5, 17, 'max', matrix))
// console.log('opt', matrix_col_optimum(5, 17, 'opt', matrix))
