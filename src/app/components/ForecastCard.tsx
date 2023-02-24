import React from 'react';

import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { CardOverflow } from '@mui/joy';

type ForecastCardProps = {
  title: string,
  icon: React.ReactElement,
  children: React.ReactNode,
  height?: string,
};

const ForecastCard = ({title, icon, children, height}: ForecastCardProps) => {
  return (
    <Stack sx={{gap: 0.5}}>        
      <Typography sx={{minWidth: '52px', maxWidth: '52px'}} level="body4" startDecorator={icon}>{title}</Typography>
      <Card variant="outlined" sx={{borderRadius: 'sm'}}>
        <CardOverflow sx={{padding: 0, height: height ?? '80px'}}>
          {children}
        </CardOverflow>
      </Card>
    </Stack>
  );
};

export default ForecastCard;
