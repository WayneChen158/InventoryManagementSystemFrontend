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

import ShippedInvoicePage from './shipped-invoice-view';
import UnshippedInvoicePage from './unshipped-invoice-view';
import CreateNewInvoiceForm from '../components/Create-new-invoice'

// ----------------------------------------------------------------------

export default function InvoicePage() {
  const [value, setValue] = useState('1');

  const [refreshTrigger, setRefreshTrigger] = useState(1);

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

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev * (-1));
  }
  
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Invoices</Typography>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          New Invoice
        </Button> 
        <CreateNewInvoiceForm
          open={openModal}
          handleClose={handleCloseModal}
          triggerRefresh={triggerRefresh}
        />
      </Stack>

        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="manufacture tabs">
              <Tab label="Unshipped" value="1" sx={{ minWidth: '120px' }}/>
              <Tab label="Shipped" value="2" sx={{ minWidth: '120px' }}/>
            </TabList>
          </Box>
          <TabPanel value="1"><UnshippedInvoicePage triggerFetch={refreshTrigger} refreshData={triggerRefresh}/></TabPanel>
          <TabPanel value="2"><ShippedInvoicePage /></TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
