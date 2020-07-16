export function createDefaultColor(idx1, idx2, idxc)
{
  let list_color = [
    // "#FFFF00", "#FFFFE0", "#FFFACD", "#FAFAD2",
    // "#FFEFD5", "#FFE4B5", "#FFDAB9", "#EEE8AA",
    // "#F0E68C", "#BDB76B", "#FFD700", "#FFF8DC",
    // "#FFEBCD", "#FFE4C4", "#FFDEAD", "#F5DEB3",
    "#DEB887", "#D2B48C", "#BC8F8F", "#F4A460",
    "#DAA520", "#B8860B", "#CD853F", "#D2691E",
    // "#00FFFF", "#E0FFFF", "#AFEEEE", "#7FFFD4",
    "#40E0D0", "#FF1493", "#DB7093", "#C71585",
    "#FFA07A", "#FA8072", "#E9967A", "#F08080",
    "#CD5C5C", "#FF4500", "#FF6347", "#778899",
    "#708090", "#2F4F4F", "#556B2F", "#808000",
    "#6B8E23", "#9ACD32", "#32CD32", "#00FF00",
    "#7CFC00", "#9932CC", "#8B008B", "#800080",
    "#4B0082", "#483D8B", "#6A5ACD", "#7B68EE",
    "#FFC0CB", "#FFB6C1", "#FF69B4", "#7FFF00",
    "#ADFF2F", "#00FF7F", "#00FA9A", "#90EE90",
    "#98FB98", "#8FBC8F", "#66CDAA", "#3CB371",
    // "#E6E6FA", "#48D1CC", "#00CED1", "#20B2AA",
    // "#5F9EA0", "#00FFFF", "#00FFFF", "#E0FFFF",
    // "#AFEEEE", "#7FFFD4", "#40E0D0", "#48D1CC",
    "#00CED1", "#20B2AA", "#5F9EA0", "#DCDCDC",
    "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080",
    "#696969", "#D8BFD8", "#DDA0DD", "#EE82EE",
    "#DA70D6", "#FF00FF", "#FF00FF", "#BA55D3",
    "#9370DB", "#8A2BE2", "#9400D3", "#FF7F50",
    "#FF8C00", "#FFA500"];

  let center_color = "#0000CD";
  let tmp_color = [];
  let ii = 0;
  for (let i=idx1; i<=idx2; i++)
  {
    if(i===idxc)
      tmp_color.push(center_color);
    else
    {
      tmp_color.push(list_color[ii]);
      ii = ii + 1;
    }
  }
  return(tmp_color);
}

export function createDefaultMarker(idx1, idx2, idxc, center_size, other_size)
{
  let tmp_marker = [];
  for (let i=idx1; i<=idx2; i++)
  {
    if(i===idxc)
      tmp_marker.push(center_size);
    else
      tmp_marker.push(other_size);
  }
  return({size: tmp_marker});
}

export function createDefaultParam()
{
  let chartOptions = {
    chart: {
      id: "chart-data",
      animations: {
        speed: 50
      }
    },
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        customIcons: []
      },
      export: {
        csv: {
          filename: 'Seismic',
          columnDelimiter: ',',
          headerCategory: 'numeric',
          headerValue: 'value',
        }
      },
      autoSelected: 'zoom'
    },
    title: {
      // text: this.title,
      align: 'left',
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'top',
      horizontalAlign: 'left',
      floating: false,
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      },
    },
    markers: {
      size: [4, 0, 0, 0]
    },
    colors: ['#FF8000', '#1E90FF', '#008000', '#800000', '#800080'],
    stroke: {
      show: true,
      width: 2,
    },
    plotOptions: {
      line: {
        distributed: true
      }
    },
    xaxis: {
      type: 'numeric',
      position: 'top',
      title: {
        offsetY: -65,
        // text: this.xaxis["label"],
        style: {
          fontSize: "120%"
        }
      },
      // categories: this.xaxis["data"],
      labels: {
        offsetY: 10,
        show: true,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
      },
      axisBorder: {
        show: true,
        color: '#000000',
        height: 1.5,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#000000',
        height: 6,
        offsetX: 0,
        offsetY: 0
      },
    },
    yaxis: {
      title: {
        // text: "Amplitude",
        style: {
          fontSize: "120%"
        }
      },
      axisBorder: {
        show: true,
        color: '#000000',
        offsetX: -8,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#000000',
        width: 3,
        offsetX: 8,
        offsetY: 0
      },
      labels: {
        show: true,
        align: 'left',
        formatter: (value) =>
        {
          return value.toFixed(2)
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#C0C0C0',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 5,
        right: 20,
        bottom: 5,
        left: 5
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
      },
      y: {
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          return value.toFixed(6)
        },
        // title: {
        //   formatter: (seriesName) => seriesName,
        // },
      },
      marker: {
        show: true,
      },
    }
  };
  return(chartOptions);
}
