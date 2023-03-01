import React from 'react';
import { DateTime } from "luxon";
import { ChartOptions, ScriptableLineSegmentContext, ScriptableChartContext, Chart, TooltipItem } from 'chart.js';

import BaseChart from './BaseChart';
import { RatingDetails, WaveDetails } from "../../../shared/types";
import { ratingColor } from '../../utils';
import { Units } from 'surfline/forecasts/types';

type RatingChartGradientProps = {
  ratings?: (RatingDetails & {datetime: DateTime})[],
  waves: (WaveDetails & {datetime: DateTime})[],
  units: Units,
};

const setupGradient = (colors: string[]): (chart: Chart) => CanvasGradient => {
  // Cache gradient since this function will be called every chart render cycle
  let gradient: CanvasGradient | null = null;
  let left = 0;
  let right = 0;

  return ({ctx, chartArea}: Chart) => {
    if (!gradient || left !== chartArea.left || right !== chartArea.right) {
      left = chartArea.left;
      right = chartArea.right;

      gradient = ctx.createLinearGradient(left, 0, right, 0);
              
      const stepSize = 1 / colors.length;
      const offset = stepSize - (left / chartArea.width);

      gradient.addColorStop(0, colors[0] as string);
      
      colors.forEach((color, index) => {
        const nextStep = ((index + 1) * stepSize) - offset;

        if (nextStep < 1) (gradient as CanvasGradient).addColorStop(nextStep, color);
      });

      // gradient.addColorStop(1, colors[colors.length - 1] as string);
    }

    return gradient;
  };
};

const RatingChartGradient = ({ratings, waves, units}: RatingChartGradientProps) => {
  const chartType = 'line';

  const data = waves.map(wave => ({x: wave.datetime, y: wave.max}));
  const maxHeight = Math.max(...waves.map(x => x.max));

  const borderColorFn = ratings ? setupGradient(ratings.map(x => ratingColor(x.key))) : undefined;

  const options: ChartOptions<typeof chartType> = {
    aspectRatio: 10,
    datasets: {
      line: {
        segment: {
          borderColor: borderColorFn 
          // incorrectly typed by lib: ScriptableChartContext is missing from context, so work around it here
          ? (context) => borderColorFn((context as ScriptableLineSegmentContext & ScriptableChartContext).chart)
          : undefined, 
        }
      }
    },
    elements: {
      line: {
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.2,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        // min -1 just so wave heights of zero don't get partially clipped
        min: -1,
        max: Math.max(25, maxHeight + 10),
        display: false,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: ({dataIndex}: TooltipItem<typeof chartType>) => {
            const wave = waves[dataIndex];
            if (!wave) throw new Error('Unexpected access error');

            const rating = ratings?.[dataIndex];
            const ratingPortion = rating ? `${rating.key} ` : '';

            const min = wave.min;
            const max = wave.max;
            const plus = wave.plus;

            return `${ratingPortion}${min}-${max}${plus ? '+' : ''} ${units.waveHeight.toLowerCase()}`;
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
      unit={units.waveHeight}
    />
  );
};

export default RatingChartGradient;
