import React from 'react';
import { DateTime }  from 'luxon';

import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';

import { useAppDispatch } from '../hooks';
import { daySelected } from '../slices/forecast-slice';

type DayTabsProps = {
  day: 0 | 1 | 2
};

const DayTabs = ({day}: DayTabsProps) => {
  const dispatch = useAppDispatch();

  return (
    <Tabs
      size="sm"
      sx={{ borderRadius: 'md' }}
      value={day}
      onChange={(_e, value) => dispatch(daySelected(value as (0 | 1 | 2)))}
    >
      <TabList variant="soft">
        <Tab value={0}>Today</Tab>
        <Tab value={1}>Tomorrow</Tab>
        <Tab value={2}>{DateTime.now().plus({days: 2}).weekdayLong}</Tab>
      </TabList>
    </Tabs>
  );
};

export default DayTabs;
