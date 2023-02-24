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

  const round = (x: number): number => Math.round(x * 10) / 10;

  const data = tideData.map(tide => ({x: tide.datetime, y: round(tide.height)}));
  const minHeight = Math.min(...tideData.map(x => x.height));
  const maxHeight = Math.max(...tideData.map(x => x.height));

  const options: ChartOptions<typeof chartType> = {
    animation: false,
    elements: {
      line: {
        tension: 0.4,
        cubicInterpolationMode: 'monotone'
      }
    },
    scales: {
      x: {
        // display: false
      },
      y: {
        suggestedMin: Math.min(0, minHeight),
        suggestedMax: Math.max(10, maxHeight + 5),
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
      },
      datalabels: {
        display: (context) => tideData[context.dataIndex]?.type !== 'NORMAL'
      }
    }
  };

  return (
    <BaseChart
      type={chartType} 
      datasets={[data]} 
      options={options} 
    />
  );
};

export default TideChart;
