import React from 'react';
import { ItemProps, ListProps, GroupProps } from 'react-virtuoso';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';


// kind of clunky mapping of different component libraries
// mostly taken from: https://virtuoso.dev/material-ui-endless-scrolling/
export default {
  List: React.forwardRef(function MUIListComponent({style, children}: ListProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
      <List 
        size="sm"
        style={{ padding: 0, ...style, margin: 0 }} 
        component="div" 
        ref={ref}
      >
        {children}
      </List>
    );
  }),

  Item: ({ children, ...props }: ItemProps<unknown>) => {
    return (
      <ListItem component="div" {...props} style={{ margin: 0 }}>
        {children}
      </ListItem>
    );
  },

  Group: ({ children, style, ...props }: GroupProps) => {
    return (
      <ListSubheader
        component="div"
        {...props}
        style={{
          ...style,
          backgroundColor: 'white',
        }}
      >
        {children}
      </ListSubheader>
    );
  },
};
