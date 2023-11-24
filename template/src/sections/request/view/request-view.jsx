import { useState } from 'react';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import { Tab, Box, Stack, Button, Container, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import RequestPurchasePageNew from './request-view-new';

export default function RequestPage() {
    const [tabValue, setTabValue] = useState('new');

    const handleTabChange = (event, newTabValue) => {
        setTabValue(newTabValue);
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Request</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                    New Purchase Request
                </Button> 
            </Stack>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange} aria-label="tabs">
                            <Tab label="New" value="new" sx={{ minWidth: '120px' }}/>
                        </TabList>
                    </Box>
                    <TabPanel value="new"><RequestPurchasePageNew /></TabPanel>
                </TabContext>
            </Box>
        </Container>
    );
}