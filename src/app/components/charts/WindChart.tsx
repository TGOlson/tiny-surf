import React from 'react';
import { DateTime }  from 'luxon';
import { ChartOptions, TooltipItem } from 'chart.js';
import { Units } from 'surfline/forecasts/types';

import BaseChart from './BaseChart';
import { WindDetails } from '../../../shared/types';

type WindChartProps = {
  data: (WindDetails & {datetime: DateTime})[],
  units: Units,
};

const WindChart = ({data: windData, units}: WindChartProps) => {
  const chartType = 'bar';

  const data = windData.map(wind => ({x: wind.datetime, y: Math.round(wind.speed)}));
  const maxSpeed = Math.max(...windData.map(x => x.speed));

  const options: ChartOptions<typeof chartType> = {
    elements: {
      bar: {
        borderRadius: 3,
      },
    },
    scales: {
      x: {
        // display: false,
      },
      y: {
        min: 0,
        suggestedMax: Math.max(20, maxSpeed + 5),
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<typeof chartType>) => {
            const wind = windData[context.dataIndex];
            if (!wind) throw new Error('Unexpected access error');

            const directionType = wind.directionType;
            const speed = context.parsed.y;

            return `${directionType} ${speed} ${units.windSpeed.toLowerCase()}.`;
          },
        }
      }
    }
  };

  return (
    <BaseChart
      type={chartType}
      datasets={[data]} 
      options={options}
      unit={units.windSpeed}
    />
  );
};

export default WindChart;
