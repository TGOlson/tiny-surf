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
      ticks: {
        display: false,
      }
    },
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
      data={{
        datasets: [{data}]
      }} 
      options={opts}
      style={{
        maxHeight: 120,
      }}
    />
  );
};

export default BaseChart;
