import React from 'react';

import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import CardOverflow from '@mui/joy/CardOverflow';

type ForecastCardProps = {
  title: string,
  icon: React.ReactElement,
  children: React.ReactNode,
};

const ForecastCard = ({title, icon, children}: ForecastCardProps) => {
  return (
    <Card variant="outlined" sx={{borderRadius: 'sm', minWidth: 0, height: '100%'}}>
      <CardOverflow sx={{padding: 0}}>
        <Typography level="body4" startDecorator={icon} sx={{padding: 1, paddingBottom: 0}}>{title}</Typography>
        {children}
      </CardOverflow>
    </Card>
  );
};

export default ForecastCard;
