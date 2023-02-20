import React from 'react';
import { DateTime }  from 'luxon';
import { ChartOptions, TooltipItem } from 'chart.js';
import { Units } from 'surfline/forecasts/types';

import BaseChart from './BaseChart';
import { TideDetails } from '../../../shared/types';

type TideChartProps = {
  data: (TideDetails & {datetime: DateTime})[],
  units: Units,
};

const TideChart = ({data: tideData, units}: TideChartProps) => {
  const chartType = 'line';

  const data = tideData.map(tide => ({x: tide.datetime, y: tide.height}));

  const options: ChartOptions<typeof chartType> = {
    elements: {
      line: {
        tension: 0.4,
        cubicInterpolationMode: 'monotone'
      }
    },
    scales: {
      y: {
        suggestedMin: -5,
        suggestedMax: 10,
        title: {
          display: true,
          text: `Height ${units.tideHeight.toLowerCase()}.`
        }
      }
    },
    plugins: {
      tooltip: {
        intersect: false,
        callbacks: {
          label: (context: TooltipItem<typeof chartType>) => {
            return `${context.parsed.y} ${units.tideHeight.toLowerCase()}.`;
          },
        }
      }
    }
  };

  return (
    <BaseChart
      type={chartType} 
      data={data} 
      options={options} 
    />
  );
};

export default TideChart;
