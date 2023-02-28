import React from 'react';
import { DateTime } from "luxon";
import { PolarArea } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

import { RatingDetails, WaveDetails } from "../../../shared/types";
import { ratingColor } from '../../utils';

type RatingRadarChartProps = {
  ratings: (RatingDetails & {datetime: DateTime})[],
  waves: (WaveDetails & {datetime: DateTime})[],
};

const RatingRadarChart = ({ratings, waves}: RatingRadarChartProps) => {

  const labels = waves.map(wave => wave.datetime.toFormat('ha').toLowerCase());
  const data = waves.map(wave => wave.max);
  const backgroundColor = ratings.map(x => ratingColor(x.key, 1));

  const options: ChartOptions<'polarArea'> = {
    scales: {
      r: {
        min: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  return (
    <PolarArea
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor,
        }]
      }} 
      options={options}
    />
  );
};

export default RatingRadarChart;
