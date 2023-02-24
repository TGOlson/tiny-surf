import React from 'react';

import Card from '@mui/joy/Card';

type ExpandableCardProps = {
  children: React.ReactNode,
};

const ExpandableCard = ({children}: ExpandableCardProps) => {

  return (
    <Card variant="outlined" sx={{borderRadius: 'xs'}}>
      {children}
    </Card>
  );
};

export default ExpandableCard;
