import React from 'react';

import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import CardContent from '@mui/joy/CardContent';

type ForecastItemProps = {
  title: string,
  icon: React.ReactElement,
  children: React.ReactNode,
  height?: string,
};

const ForecastItem = ({title, icon, children, height}: ForecastItemProps) => {
  return (
    <Stack>        
      <Typography level="body4" startDecorator={icon}>{title}</Typography>
      <CardContent sx={{padding: 0, height: height ?? '90px'}}>
        {children}
      </CardContent>
    </Stack>
  );
};

export default ForecastItem;
