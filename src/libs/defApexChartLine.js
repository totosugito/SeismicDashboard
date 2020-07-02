export function createDefaultParam()
{
  let chartOptions = {
    chart: {
      id: "ApexChartLine",
      animations: {
        speed: 200
      }
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
      title: {
        // text: this.xaxis["label"],
        style: {
          fontSize: "120%"
        }
      },
      // categories: this.xaxis["data"],
      labels: {
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
      marker: {
        show: false,
      },
    }
  };
  return(chartOptions);
}
