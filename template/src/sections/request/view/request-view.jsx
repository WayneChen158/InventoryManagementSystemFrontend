import { useRef, useState, useEffect } from 'react';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import { Tab, Box, Modal, Stack, Button, Container, Typography } from '@mui/material';

import { getRequestsURL, getProductsURL, getComponentsURL, getRawMaterialsURL, getProductRecordsURL, getComponentRecordsURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import RequestPurchasePage from './request-view-purchase';
import NewRequestForm from '../components/NewRequestForm';
import RequestInternalPage from './request-view-internal';

export default function RequestPage() {
    const [tabValue, setTabValue] = useState('new-purchase');

    const [openModal, setOpenModal] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(1);

    const [requestData, setRequestData] = useState([]);
    
    const [inventoryData, setInventoryData] = useState([]);

    const [internalComponentData, setInternalComponentData] = useState([]);

    const [internalComponentRecordData, setInternalComponentRecordData] = useState([]);

    const [internalProductData, setInternalProductData] = useState([]);

    const [internalProductRecordData, setInternalProductRecordData] = useState([]);

    const rawMaterialsURL = useRef(getRawMaterialsURL());

    const requestsURL = useRef(getRequestsURL());

    const componentsURL = useRef(getComponentsURL());

    const componentRecordsURL = useRef(getComponentRecordsURL());

    const productsURL = useRef(getProductsURL());

    const productRecordsURL = useRef(getProductRecordsURL());

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
        fetch(componentRecordsURL.current)
        .then(res => res.json())
        .then(data => {
            console.log("Component Record Fetch Invoked!");
            console.log(data);
            setInternalComponentRecordData(data);
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

    useEffect(() => {
        fetch(productRecordsURL.current)
        .then(res => res.json())
        .then(data => {
            console.log("Product Record Fetch Invoked!");
            console.log(data);
            setInternalProductRecordData(data);
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
                            internalComponentRecords={internalComponentRecordData}
                            internalProducts={internalProductData}
                            internalProductRecords={internalProductRecordData}
                        />
                    </Box>
                </Modal> 
            </Stack>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange} aria-label="tabs">
                            <Tab label="New Purchase" value="new-purchase" sx={{ minWidth: '120px' }}/>
                            <Tab label="Ongoing Purchase" value="ongoing-purchase" sx={{ minWidth: '120px' }}/>
                            <Tab label="Completed Purchase" value="complete-purchase" sx={{ minWidth: '120px' }}/>
                            <Tab label="New Internal" value="new-internal" sx={{ minWidth: '120px' }}/>
                            <Tab label="Fulfilled Internal" value="fulfilled-internal" sx={{ minWidth: '120px' }}/>
                        </TabList>
                    </Box>
                    <TabPanel value="new-purchase">
                        <RequestPurchasePage 
                            allRequestData={requestData}
                            statusCodes={[1]}
                            categoryCode={1} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                    <TabPanel value="ongoing-purchase">
                        <RequestPurchasePage 
                            allRequestData={requestData}
                            statusCodes={[2, 3]}
                            categoryCode={1} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                    {/* Partially and fully received puchase requests */}
                    <TabPanel value="complete-purchase">
                        <RequestPurchasePage 
                            allRequestData={requestData}
                            statusCodes={[4]}
                            categoryCode={1} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                    <TabPanel value="new-internal">
                        <RequestInternalPage 
                            allRequestData={requestData}
                            statusCode={1}
                            categoryCode={2} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                    <TabPanel value="fulfilled-internal">
                        <RequestInternalPage 
                            allRequestData={requestData}
                            statusCode={2}
                            categoryCode={2} 
                            triggerRefresh={triggerRefresh}
                        />
                    </TabPanel>
                </TabContext>
            </Box>
        </Container>
    );
}