
export function createTableWellHeader()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true
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
    }
  ];
  return (table_headers);
}

export function createTableGeobodyListHeader()
{
  let table_headers = [
    {
      key: 'area',
      label: 'Area',
      sortable: true
    },
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true
    },
    {
      key: 'X',
      label: 'X Coord',
      sortable: false,
    },
  ];
  return (table_headers);
}

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
  ];
  return (table_headers);
}
