import { useRef, useState, useEffect } from 'react';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import { Tab, Box, Modal, Stack, Button, Container, Typography } from '@mui/material';

import { getRawMaterialsURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import RequestPurchasePageNew from './request-view-new';
import NewRequestForm from '../components/NewRequestForm';

export default function RequestPage() {
    const [tabValue, setTabValue] = useState('new');

    const [openModal, setOpenModal] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(1);

    const [inventoryData, setInventoryData] = useState([]);

    const rawMaterialsURL = useRef(getRawMaterialsURL());

    const handleTabChange = (event, newTabValue) => {
        setTabValue(newTabValue);
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev * (-1));
    }

    useEffect(() => {
        fetch(rawMaterialsURL.current)
        .then(res => res.json())
        .then(data => {
          console.log("Raw Material Fetch Invoked!")
          console.log(data)
          setInventoryData(data)
        })
      }, [refreshTrigger]);

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Request</Typography>
                
                <Button 
                    variant="contained" 
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleOpenModal}
                >
                    New Purchase Request
                </Button>

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    container={document.getElementById('root')}
                >
                    <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
                        <NewRequestForm 
                            handleCloseModal={handleCloseModal}
                            triggerRefresh={triggerRefresh}
                            inventoryItems={inventoryData}
                        />
                    </Box>
                </Modal> 
            </Stack>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange} aria-label="tabs">
                            <Tab label="New" value="new" sx={{ minWidth: '120px' }}/>
                        </TabList>
                    </Box>
                    <TabPanel value="new">
                        <RequestPurchasePageNew statusCode={1} refreshTrigger={refreshTrigger}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </Container>
    );
}