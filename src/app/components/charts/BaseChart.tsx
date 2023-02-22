import React from 'react';
import { Chart } from 'react-chartjs-2';
import { ChartOptions, ChartType } from 'chart.js';
import { DateTime } from 'luxon';
import { mergeDeepLeft } from 'ramda';
import Box from '@mui/joy/Box';

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
  maintainAspectRatio: false,
  layout: {
    padding: 0,
  },
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
        padding: 0,
        backdropPadding: 0,
        minRotation: 0,
        maxRotation: 0,
        font: {
          // size: 10,
        },
        callback: (val, index) => {
          if (index !== 0 && index % 3 === 0) {
            return typeof val === 'string' ? val : DateTime.fromMillis(val).toFormat('ha').toLowerCase();
          }

          return null;
        }
      },
    },
    y: {
      display: false,
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
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      clamp: true,
      font: {
        weight: 'bold',
      },
      display: (context) => context.dataIndex !== 0 && context.dataIndex % 3 === 0,
      formatter: (val: {x: DateTime, y: number}) => val.y,
      padding: {
        bottom: -5,
      }
    }
  }
};

type BaseChartProps = {
  type: 'line' | 'bar',
  data: {x: DateTime, y: number}[],
  options: ChartOptions,
};

const BaseChart = ({type, data, options}: BaseChartProps) => {
  const opts = mergeOptions(options, commonOptions);

  // some chart have weird padding that I can't get ride of
  // use this to pixel-push X-axis margins and make things line up
  const margins = type === 'line' ? {marginLeft: '-4px', marginRight: '-5px'} : {marginRight: '-2px'};

  return (
    <Box sx={{width: '100%', maxHeight: '100px'}}>
      <Chart
        type={type} 
        plugins={[ChartDataLabels]}
        data={{
          datasets: [{data}]
        }} 
        options={opts}
        style={{...margins}}
      />
    </Box>
  );
};

export default BaseChart;
