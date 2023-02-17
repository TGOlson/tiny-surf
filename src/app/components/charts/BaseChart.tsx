import React from 'react';
import { Chart } from 'react-chartjs-2';

import { commonOptions, mergeOptions } from './util';
import { ChartOptions } from 'chart.js';
import { DateTime } from 'luxon';

// import chart.js for side effects
// alternative is to use `.register` on every component we use
// TODO: consider using register to reduce bundle size
import 'chart.js/auto';
import 'chartjs-adapter-luxon';

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
    />
  );
};

export default BaseChart;
