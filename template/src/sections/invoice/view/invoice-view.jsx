import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

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

import { getRequestsURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import RequestInternalPage from 'src/sections/request/view/request-view-internal';

import NewTaskForm from '../components/NewTaskForm';
import ManufacturePageTwo from './manufacture-view-2';
import ManufacturePageThree from './manufacture-view-3';

// ----------------------------------------------------------------------

export default function InvoicePage() {
  const [value, setValue] = useState('1');

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  const [requestData, setRequestData] = useState([]);

  const requestsURL = useRef(getRequestsURL());

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

  useEffect(() => {
    fetch(requestsURL.current)
    .then(res => res.json())
    .then(data => {
        console.log("Request Fetch Invoked!");
        console.log(data);
        setRequestData(data);
    })
  }, [refreshTrigger]);
  
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Manufacture</Typography>

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
                handleRefreshData={triggerRefresh}
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
          <TabPanel value="1">
            <RequestInternalPage 
              allRequestData={requestData}
              statusCode={1}
              categoryCode={2} 
              triggerRefresh={triggerRefresh}
            />
          </TabPanel>
          <TabPanel value="2"><ManufacturePageTwo triggerFetch={refreshTrigger} refreshData={triggerRefresh}/></TabPanel>
          <TabPanel value="3"><ManufacturePageThree /></TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
