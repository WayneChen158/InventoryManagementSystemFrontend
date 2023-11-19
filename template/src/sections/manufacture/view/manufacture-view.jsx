import * as React from 'react';
import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import NewTaskForm from '../components/NewTaskForm';
import ManufacturePageOne from './manufacture-view-1';
import ManufacturePageTwo from './manufacture-view-2';
import ManufacturePageThree from './manufacture-view-3';

// ----------------------------------------------------------------------

export default function ManufacturePage() {
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
        <Typography variant="h4">Manufacture</Typography>

        {/* {button onClick need to be implemented} */}
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          New Task
        </Button> 

        <Modal
            open={openModal}
            onClose={handleCloseModal}
            container={document.getElementById('root')}
          >
            <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
              <NewTaskForm 
                handleCloseModal={handleCloseModal}
                handleRefreshData={refreshData}
              />
            </Box>
          </Modal>
      </Stack>

        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="manufacture tabs">
              <Tab label="Request" value="1" sx={{ minWidth: '120px' }}/>
              <Tab label="On Going" value="2" sx={{ minWidth: '120px' }}/>
              <Tab label="Done" value="3" sx={{ minWidth: '120px' }}/>
            </TabList>
          </Box>
          <TabPanel value="1"><ManufacturePageOne /></TabPanel>
          <TabPanel value="2"><ManufacturePageTwo triggerFetch={triggerFetch} refreshData={refreshData}/></TabPanel>
          <TabPanel value="3"><ManufacturePageThree /></TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
