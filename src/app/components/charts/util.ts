import { ChartOptions, ChartType } from 'chart.js';
import { mergeDeepLeft } from 'ramda';
// import { Chart } from 'react-chartjs-2';

export function mergeOptions<T extends ChartType, Opts extends object = NonNullable<ChartOptions<T>>> (o1: Opts, o2: Opts): Opts {
  // a little unsafe with type cohersion, but mergedeep doesn't want to work otherwise
  return mergeDeepLeft(o1, o2) as Opts;
}

export const commonOptions: ChartOptions = {
  elements: {
    point: {
      pointStyle: false
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        tooltipFormat: 't', // Luxon format string
      },
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
