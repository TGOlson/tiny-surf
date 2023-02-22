import React from 'react';
import { Chart } from 'react-chartjs-2';
import { ChartOptions, ChartType } from 'chart.js';
import { DateTime } from 'luxon';
import { mergeDeepLeft } from 'ramda';

// import chart.js for side effects
// alternative is to use `.register` on every component we use
// TODO: consider using register to reduce bundle size
import 'chart.js/auto';
import 'chartjs-adapter-luxon';
import ChartDataLabels from 'chartjs-plugin-datalabels';


function mergeOptions<T extends ChartType, Opts extends object = NonNullable<ChartOptions<T>>> (o1: Opts, o2: Opts): Opts {
  // a little unsafe with type cohersion, but mergedeep doesn't want to work otherwise
  // mergeDeepLeft<T, T> => T
  return mergeDeepLeft(o1, o2) as Opts;
}

const commonOptions: ChartOptions = {
  elements: {
    point: {
      pointStyle: false
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          hour: 'ha'
        },
        // Luxon format string
        tooltipFormat: 'h a',
      },
      grid: {
        tickLength: 4,
        drawOnChartArea: false,
      },
      ticks: {
        padding: 1,
        minRotation: 0,
        maxRotation: 0,
        callback: (val) => typeof val === 'string' ? val : DateTime.fromMillis(val).toFormat('ha').toLowerCase(),
      },
    },
    y: {
      display: false,
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  plugins: {
    legend: {
        display: false,
    },
    tooltip: {
      displayColors: false,
      intersect: false,
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      display: (context) => context.dataIndex % 3 === 0,
      formatter: (val: {x: DateTime, y: number}) => val.y,
      padding: {
        bottom: 0
      }
    }
  }
};

type BaseChartProps = {
  type: 'line' | 'bar',
  data: {x: DateTime, y: number}[],
  options: ChartOptions
};

const BaseChart = ({type, data, options}: BaseChartProps) => {
  const opts = mergeOptions(options, commonOptions);

  return (
    <Chart
      type={type} 
      plugins={[ChartDataLabels]}
      data={{
        datasets: [{data}]
      }} 
      options={opts}
      style={{
        maxHeight: 100,
      }}
    />
  );
};

export default BaseChart;
