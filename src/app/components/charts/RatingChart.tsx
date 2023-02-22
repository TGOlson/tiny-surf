import React from 'react';

import { DateTime } from "luxon";
import { RatingDetails } from "../../../shared/types";
import Box from "@mui/joy/Box";
import { ratingColor } from '../../utils';

type RatingChartProps = {
  data: (RatingDetails & {datetime: DateTime})[],
};

const RatingChart = ({data}: RatingChartProps) => {
  return (
    <Box sx={{height: '6px', borderRadius: 'sm', display: 'flex', justifyContent: 'space-evenly', overflow: 'clip', flexGrow: 1}}>
      {data.map(rating => (
        <Box key={rating.timestamp} sx={{backgroundColor: ratingColor(rating.key), flexGrow: 1}}></Box>
      ))}
    </Box>
  );
};

export default RatingChart;
