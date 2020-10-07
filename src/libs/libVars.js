
export function createTableWellHeader()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true,
    },
    {
      key: 'area',
      label: 'Area',
      sortable: true
    },
    {
      key: 'X',
      label: 'X Coord',
      sortable: false,
    },
    {
      key: 'Y',
      label: 'Y Coord',
      sortable: false,
    },
    {
      key: 'Z',
      label: 'Z Coord',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

// export function createTableGeobodyListHeader()
// {
//   let table_headers = [
//     {
//       key: 'area',
//       label: 'Area',
//       sortable: true
//     },
//     {
//       key: 'well_id',
//       label: 'Well ID',
//       sortable: true
//     },
//     {
//       key: 'X',
//       label: 'X Coord',
//       sortable: false,
//     },
//   ];
//   return (table_headers);
// }

export function createTableAreaListHeader()
{
  let table_headers = [
    {
      key: 'area',
      label: 'Area',
      sortable: true
    },
    {
      key: 'note',
      label: 'Note',
      sortable: true
    },
    {
      key: 'lat',
      label: 'Latitude',
      sortable: false,
    },
    {
      key: 'lon',
      label: 'Longitude',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableGeobodyListHeader()
{
  let table_headers = [
    {
      key: 'geobody_id',
      label: 'Geobody ID',
      sortable: true
    },
    {
      key: 'cls',
      label: 'Class',
      sortable: true
    },
    {
      key: 'nop',
      label: 'NPoints',
      sortable: true
    },
    {
      key: 'xcoord',
      label: 'X',
      sortable: false,
    },
    {
      key: 'ycoord',
      label: 'Y',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableGeobodyFileListHeader()
{
  let table_headers = [
    {
      key: 'col_geobody_id',
      label: 'Col Geobody ID',
      sortable: true
    },
    {
      key: 'cls_z',
      label: 'Class',
      sortable: true
    },
    {
      key: 'file_name',
      label: 'Filename',
      sortable: true
    },
    {
      key: 'note',
      label: 'Note',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableWellHeaderBySelectedGeobody()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true
    },
    {
      key: 'eucd',
      label: 'EUCD',
      sortable: true
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableGatherHeader()
{
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'freq',
      label: 'Number of Traces',
      sortable: true
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}

export function createTableSectionHeader()
{
  let table_headers = [
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'freq',
      label: 'Freq',
      sortable: true
    },
    {
      key: 'segy_file_id',
      label: 'SEGY ID',
      sortable: true
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}
