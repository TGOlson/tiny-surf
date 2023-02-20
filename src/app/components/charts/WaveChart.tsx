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

  const options: ChartOptions<typeof chartType> = {
    elements: {
      line: {
        fill: true,
        tension: 0.2,
      }
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: 15,
        ticks: {
          callback: (x) => `${x} ${units.waveHeight.toLowerCase()}.`
        }
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
      data={data} 
      options={options}
    />
  );
};

export default WaveChart;
