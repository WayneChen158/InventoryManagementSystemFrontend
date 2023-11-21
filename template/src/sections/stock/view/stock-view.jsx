import * as React from 'react';
import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import ProductPage from './product-view';
import ComponentPage from './component-view';

// ----------------------------------------------------------------------

export default function StockPage() {
  const [value, setValue] = useState('1');

  const [triggerFetch, setTriggerFetch] = useState(0);

  const refreshData = () => {
    console.log(`triggered from ${triggerFetch}`)
    setTriggerFetch(prev => prev + 1); // Toggle the state to trigger useEffect
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [openModal, setOpenModal] = useState(false);
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Stock</Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          New Task
        </Button> 

      </Stack>

        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="manufacture tabs">
              <Tab label="Products" value="1" sx={{ minWidth: '120px' }}/>
              <Tab label="Components" value="2" sx={{ minWidth: '120px' }}/>
            </TabList>
          </Box>
          <TabPanel value="1"><ProductPage /></TabPanel>
          <TabPanel value="2"><ComponentPage /></TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
