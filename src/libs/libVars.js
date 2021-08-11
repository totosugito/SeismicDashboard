
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

export function createTableWellHeaderV0()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true,
    },
    {
      key: 'xmd',
      label: 'X Coord',
      sortable: false,
    },
    {
      key: 'ymd',
      label: 'Y Coord',
      sortable: false,
    },
    {
      key: 'zmd',
      label: 'Z Coord',
      sortable: false,
    },
    {
      key: 'show_marker',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
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

// export function createTableAreaListHeader()
// {
//   let table_headers = [
//     {
//       key: 'area',
//       label: 'Area',
//       sortable: true
//     },
//     {
//       key: 'note',
//       label: 'Note',
//       sortable: true
//     },
//     // {
//     //   key: 'lat',
//     //   label: 'Latitude',
//     //   sortable: false,
//     // },
//     // {
//     //   key: 'lon',
//     //   label: 'Longitude',
//     //   sortable: false,
//     // },
//     {
//       key: 'action',
//       label: 'Action',
//       sortable: false,
//     },
//   ];
//   return (table_headers);
// }

export function createTableWellListHeader() {
  let table_headers = [
    // {
    //   key: 'area',
    //   label: 'Area',
    //   sortable: true
    // },
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true
    },
    {
      key: 'depth_corr',
      label: 'Depth Corr.',
      sortable: true
    },
    {
      key: 'check',
      label: 'Plot',
      sortable: false,
      thStyle: { width: '40px'}
    },
  ];
  return(table_headers);
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
export function createTableGeobodyListHeaderV0()
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
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'nop',
      label: 'NPoints',
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      // thClass: 'text-center',
    },
    {
      key: 'show_marker',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}
export function createTableGeobodyListHeaderV1()
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
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'nop',
      label: 'NPoints',
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      // thClass: 'text-center',
    },
    {
      key: 'show_marker',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}
export function createTableAreaListHeaderV0()
{
  let table_headers = [
    // {
    //   key: 'id_area',
    //   label: 'ID Area',
    //   sortable: true
    // },
    {
      key: 'area',
      label: 'Area Name',
      sortable: true
    },
    {
      key: 'note',
      label: 'Area Note',
      sortable: false
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableAreaListHeader()
{
  let table_headers = [
    {
      thStyle: '{width: 30px; min-width: 20px; max-width: 50px;}',
      key: 'id_color',
      label: '',
      sortable: false
    },
    {
      key: 'id_area',
      label: 'ID Area',
      sortable: true
    },
    {
      key: 'name',
      label: 'Area Name',
      sortable: true
    },
    // {
    //   key: 'coordinate',
    //   label: 'Coordinate',
    //   sortable: false
    // },
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
      label: 'Freq',
      sortable: true
    },
    {
      key: 'segy_file_id',
      label: 'SEGY ID',
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

export function createTableProbabilityHeader()
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
    // {
    //   key: 'cdp_x',
    //   label: 'CDP X',
    //   sortable: true
    // },
    // {
    //   key: 'cdp_y',
    //   label: 'CDP Y',
    //   sortable: true
    // },
    {
      key: 'cdp_z',
      label: 'CDP Z',
      sortable: true
    },
    {
      key: 'eucd',
      label: 'EUCD',
      sortable: true
    },
    {
      key: 'prob',
      label: 'Prob',
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

export function createTableGeobodySectionHeaders() {
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
      key: 'num.trace',
      label: 'ntrc',
      sortable: true
    },
  ];
  return (table_headers);
}

export function createTableAvaHeaderV0()
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
      key: 'cdp_x',
      label: 'CDP X',
      sortable: true
    },
    {
      key: 'cdp_y',
      label: 'CDP Y',
      sortable: true
    },
    {
      key: 'cdp_z',
      label: 'CDP Z',
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

export function createTableProbHeaderV0()
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
      key: 'cdp_x',
      label: 'CDP X',
      sortable: true
    },
    {
      key: 'cdp_y',
      label: 'CDP Y',
      sortable: true
    },
    {
      key: 'cdp_z',
      label: 'CDP Z',
      sortable: true
    },
    // {
    //   key: 'count',
    //   label: 'Count',
    //   sortable: true
    // },
    // {
    //   key: 'prob1',
    //   label: 'Prob1',
    //   sortable: true
    // },
    // {
    //   key: 'prob2',
    //   label: 'Prob2',
    //   sortable: true
    // },
    {
      key: 'prob',
      label: 'Prob',
      sortable: true
    },
    // {
    //   key: 'cdp_z',
    //   label: 'CDP Z',
    //   sortable: true
    // },
    // {
    //   key: 'eucd',
    //   label: 'EUCD',
    //   sortable: true
    // },
    // {
    //   key: 'prob',
    //   label: 'Prob',
    //   sortable: true
    // },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}
export function createTableSegyListAdmin()
{
  let table_headers = [
    {
      key: 'label_name',
      label: 'Label',
      sortable: true
    },
    {
      key: 'file_loc',
      label: 'Location',
      sortable: true
    },
    {
      key: 'note',
      label: 'Note',
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

export function createAvaPointModel()
{
  let model_ava_point = {
    id_area: 0,
      gather_file_name: "",
      substack_file_name: "",
      xline: 0,
      iline: 0,
      cdp_z: 500,
      type: 'ilxl',
      rad_x: 100,
      rad_y: 50,
      rad_z: 15,
  };
  return(model_ava_point);
}

export function createAvaPointSchema()
{
  let schema_ava_point = {
    fields: [
      {
        type: 'select',
        label: 'Select Gather File',
        model: 'gather_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'select',
        label: 'Select SubStack File',
        model: 'substack_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'select',
        label: 'Select Data Type',
        model: 'type',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius X',
        model: 'rad_x',
        placeholder: 'Set Radius X',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Y',
        model: 'rad_y',
        placeholder: 'Set Radius Y',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Z',
        model: 'rad_z',
        placeholder: 'Set Radius Z',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'CDP Z',
        model: 'cdp_z',
        placeholder: 'Set CDP Z',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'XLine/X',
        model: 'xline',
        placeholder: 'Set XLine',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'ILine/Y',
        model: 'iline',
        placeholder: 'Set ILine',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_ava_point);
}

export function createAvaGeobodyModel()
{
  let model_ava_geobody = {
    id_area: 0,
    gather_file_name: "",
    substack_file_name: "",
    geobody_id: "",
    rad_x: 50,
    rad_y: 50,
    rad_z: 15
  };
  return(model_ava_geobody);
}
export function createAvaGeobodySchema()
{
  let schema_ava_geobody = {
    fields: [
      {
        type: 'select',
        label: 'Select Gather File',
        model: 'gather_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'select',
        label: 'Select SubStack File',
        model: 'substack_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius X',
        model: 'rad_x',
        placeholder: 'Set Radius X',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Y',
        model: 'rad_y',
        placeholder: 'Set Radius Y',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Z',
        model: 'rad_z',
        placeholder: 'Set Radius Z',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_ava_geobody);
}

export function createProbModel()
{
  let model_prob = {
      label_name: "",
    };
  return(model_prob);
}

export function createProbSchema()
{
  let schema_prob = {
    fields: [
      {
        type: 'select',
        label: 'Select File',
        model: 'label_name',
        selectOptions: {hideNoneSelectedText: true}
      },
    ]
  };
  return(schema_prob);
}

export function createAvaPlotModel()
{
  let model_prob = {
    label_name: "",
  };
  return(model_prob);
}
export function createAvaPlotSchema()
{
  let schema_prob = {
    fields: [
      {
        type: 'select',
        label: 'Select Gather File',
        model: 'label_name',
        selectOptions: {hideNoneSelectedText: true}
      },
    ]
  };
  return(schema_prob);
}

export function createListSectionModel() {
  let model = {
    stack_label_name: 0,
    rad: 100
  };
  return(model);
}
export function createListSectionSchema() {
  let schema_ = {
    fields: [
      {
        type: 'select',
        label: 'Select SubStack File',
        model: 'substack_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Radius',
        model: 'rad',
        placeholder: 'Set Radius',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_);
}

export function createWellInGeobodyModel() {
  let model = {
    id_area: 0,
    x: 0,
    y: 0,
    rad: 100
  };
  return(model);
}

export function createWellInGeobodySchema()
{
  let schema_prob = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'X Location',
        model: 'x',
        placeholder: 'Set X location',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Y Location',
        model: 'y',
        placeholder: 'Set Y location',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Radius',
        model: 'rad',
        placeholder: 'Set Radius',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_prob);
}

export function createTableAreaListHeader_V1()
{
  let table_headers = [
    {
      key: 'id_area',
      label: 'ID',
      sortable: true,
      thClass: 'text-center',
      tdClass: 'text-center',
      thStyle: '{width: 30px; min-width: 20px; max-width: 30px;}',
    },
    {
      key: 'name',
      label: 'Area Name',
      sortable: true,
      thClass: 'text-center',
    },
    {
      key: 'area_show',
      label: 'Area',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center',
      thStyle: '{width: 30px; min-width: 20px; max-width: 30px;}',
    },
    {
      key: 'heatmap_available',
      label: 'Data',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center',
      thStyle: '{width: 30px; min-width: 20px; max-width: 30px;}',
    },
    {
      key: 'heatmap_show',
      label: 'Layer',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-left',
      thStyle: '{width: 30px; min-width: 20px; max-width: 30px;}',
    },
  ];
  return (table_headers);
}
export function createTableHeatmapLayerHeader()
{
  let table_headers = [
    {
      key: 'name',
      label: 'Layer Name',
      sortable: true,
      thClass: 'text-center',
    },
    {
      thStyle: '{width: 30px; min-width: 20px; max-width: 50px;}',
      key: 'show_layer',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}

export function createTableAreaListHeader2_V1()
{
  let table_headers = [
    {
      key: 'survey_name',
      label: 'Survey Name',
      sortable: true
    },
  ];
  return (table_headers);
}
export function createTableAreaListHeader3_V1()
{
  let table_headers = [
    {
      key: 'dataset_name',
      label: 'Dataset Name',
      sortable: true
    },
  ];
  return (table_headers);
}

export function createTableProposeProspectBoxHeader()
{
  let table_headers = [
    {
      key: 'name',
      label: '',
      sortable: true,
      // thStyle: { width: '40px'}
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
      key: 'x',
      label: 'X',
      sortable: true
    },
    {
      key: 'y',
      label: 'Y',
      sortable: true
    },
  ];
  return (table_headers);
}
