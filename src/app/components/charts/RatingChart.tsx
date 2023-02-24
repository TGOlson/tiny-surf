import React from 'react';
import { DateTime } from "luxon";
import { ChartOptions, ScriptableLineSegmentContext, ScriptableChartContext, Chart, TooltipItem } from 'chart.js';

import BaseChart from './BaseChart';
import { RatingDetails } from "../../../shared/types";
import { ratingColor } from '../../utils';

type RatingChartProps = {
  data: (RatingDetails & {datetime: DateTime})[],
  type: 'line' | 'bar',
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
        (gradient as CanvasGradient).addColorStop(nextStep, color);
      });

      gradient.addColorStop(1, colors[colors.length - 1] as string);
    }

    return gradient;
  };
};

const RatingChart = ({data: ratingData, type: chartType}: RatingChartProps) => {
  const data = ratingData.map(rating => ({x: rating.datetime, y: Math.round(rating.value) + 1}));
  const dataInverse = data.map(d => ({...d, y: d.y * -1}));

  const borderColors = ratingData.map(x => ratingColor(x.key));
  const backgroundColors = ratingData.map(x => ratingColor(x.key, 1));

  const makeBorderGradient = setupGradient(borderColors);
  const makeBackgroundGradient = setupGradient(backgroundColors);

  const options: ChartOptions<typeof chartType> = {
    animation: false,
    datasets: {
      line: {
        fill: true,
        segment: {
          borderColor: (context) => {
            // incorrectly typed by lib: ScriptableChartContext is missing from context, so work around it here
            return makeBorderGradient((context as ScriptableLineSegmentContext & ScriptableChartContext).chart);
          },
          backgroundColor: (context) => {
            // incorrectly typed by lib: ScriptableChartContext is missing from context, so work around it here
            return makeBackgroundGradient((context as ScriptableLineSegmentContext & ScriptableChartContext).chart);
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 3,
        backgroundColor: (ctx) => backgroundColors[ctx.dataIndex],
      },
      line: {
        fill: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        suggestedMin: -6,
        suggestedMax: 6,
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<typeof chartType>) => {
            const rating = ratingData[context.dataIndex];
            if (!rating) throw new Error('Unexpected access error');

            return rating.key;
          },
        }
      }
    }
  };

  return (
    <BaseChart
      type={chartType} 
      datasets={[data, dataInverse]} 
      options={options}
    />
  );
};

export default RatingChart;
