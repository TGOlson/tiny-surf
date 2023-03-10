import React from 'react';
import { DateTime }  from 'luxon';
import { ChartOptions, TooltipItem } from 'chart.js';
import { Units } from 'surfline/forecasts/types';

import BaseChart from './BaseChart';
import { WaveDetails } from '../../../shared/types';

type WaveChartProps = {
  data: (WaveDetails & {datetime: DateTime})[],
  units: Units,
};

const WaveChart = ({data: waveData, units}: WaveChartProps) => {
  const chartType = 'line';
  
  const data = waveData.map(wave => ({x: wave.datetime, y: wave.max}));
  const maxHeight = Math.max(...waveData.map(x => x.max));

  const options: ChartOptions<typeof chartType> = {
    elements: {
      line: {
        fill: true,
        tension: 0.2,
      }
    },
    scales: {
      x: {
        // display: false,
      },
      y: {
        min: 0,
        suggestedMax: Math.max(20, maxHeight + 5),
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<typeof chartType>) => {
            const wave = waveData[context.dataIndex];
            if (!wave) throw new Error('Unexpected access error');

            const min = wave.min;
            const max = context.parsed.y;
            const plus = wave.plus;

            return `${min}-${max}${plus ? '+' : ''} ${units.waveHeight.toLowerCase()}.`;
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
    />
  );
};

export default WaveChart;
