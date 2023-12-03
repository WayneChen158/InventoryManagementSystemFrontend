import { useRef, useState, useEffect } from 'react';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import { Tab, Box, Modal, Stack, Button, Container, Typography } from '@mui/material';

import { getRequestsURL, getProductsURL, getComponentsURL, getRawMaterialsURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import RequestPurchasePage from './request-view-purchase';
import NewRequestForm from '../components/NewRequestForm';

export default function RequestPage() {
    const [tabValue, setTabValue] = useState('new-purchase');

    const [openModal, setOpenModal] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(1);

    const [requestData, setRequestData] = useState([]);
    
    const [inventoryData, setInventoryData] = useState([]);

    const [internalComponentData, setInternalComponentData] = useState([]);

    const [internalProductData, setInternalProductData] = useState([]);

    const rawMaterialsURL = useRef(getRawMaterialsURL());

    const requestsURL = useRef(getRequestsURL());

    const componentsURL = useRef(getComponentsURL());

    const productsURL = useRef(getProductsURL());

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

    useEffect(() => {
        fetch(requestsURL.current)
        .then(res => res.json())
        .then(data => {
            console.log("Request Fetch Invoked!");
            console.log(data);
            setRequestData(data);
        })
    }, [refreshTrigger]);

    useEffect(() => {
        fetch(componentsURL.current)
        .then(res => res.json())
        .then(data => {
            console.log("Component Fetch Invoked!");
            console.log(data);
            setInternalComponentData(data);
        })
    }, [refreshTrigger]);

    useEffect(() => {
        fetch(productsURL.current)
        .then(res => res.json())
        .then(data => {
            console.log("Product Fetch Invoked!");
            console.log(data);
            setInternalProductData(data);
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
                    New Request
                </Button>

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    container={document.getElementById('root')}
                >
                    <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
                        <NewRequestForm 
                            complete
                            handleCloseModal={handleCloseModal}
                            triggerRefresh={triggerRefresh}
                            inventoryItems={inventoryData}
                            internalComponents={internalComponentData}
                            internalProducts={internalProductData}
                        />
                    </Box>
                </Modal> 
            </Stack>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange} aria-label="tabs">
                            <Tab label="New Purchase Request" value="new-purchase" sx={{ minWidth: '120px' }}/>
                            <Tab label="Ongoing Purchase Request" value="ongoing-purchase" sx={{ minWidth: '120px' }}/>
                            <Tab label="New Internal Request" value="new-internal" sx={{ minWidth: '120px' }}/>
                            <Tab label="Ongoing Internal Request" value="ongoing-internal" sx={{ minWidth: '120px' }}/>
                        </TabList>
                    </Box>
                    <TabPanel value="new-purchase">
                        <RequestPurchasePage 
                            allRequestData={requestData}
                            statusCode={1} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                    <TabPanel value="ongoing-purchase">
                        <RequestPurchasePage 
                            allRequestData={requestData}
                            statusCode={2} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                </TabContext>
            </Box>
        </Container>
    );
}