import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import SearchIcon from "@mui/icons-material/Search";


const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
  position: 'relative', // Fixed position
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'grey',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: `${drawerWidth * 0.8}px`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  marginTop: '20px'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 1, 5, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(10, 1, 5, 10),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: `${drawerWidth * 0.8}px`,
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Sidebar() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }, zIndex: 1,
        }}
      >

        <Button variant="contained" 
          style={{backgroundColor: '#2775BC', color: 'white', width: `${drawerWidth * 0.8}px`, display: 'block', margin: '0 auto', marginTop: '150px'}}>
          + Add Item
        </Button>

        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
        </Search>

        <Box sx={{ display: 'flex' }}></Box>
        
        <Box sx={{ overflow: 'auto' }} style={{margin: '0 auto'}}>
          <List>
            {['Type', 'Location', 'Owner', 'Vendor'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton style={{padding:'10px, 10px, 10px, 10px'}}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
  
        </Box>
      </Drawer>
    </Box>
  );
}