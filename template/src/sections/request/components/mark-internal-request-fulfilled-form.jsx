import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Grid, Stack, Button, TextField } from '@mui/material';

import { markOrderedRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import { convertDateFormat } from '../utils';

export default function MarkInternalRequestFulfilledForm({
    targetRequestId,
    itemDescription,
    itemCatalog,
    requestAmount,
    requestBy,
    handleCloseModal,
    triggerRefresh,
}) {

    const markOrderedURL = useRef(markOrderedRequestURL());
    
    const [fulfilledAmount, setFulfilledAmount] = useState(requestAmount);

    const [doneBy, setDoneBy] = useState('');

    const handleFulfilledAmountChange = (event) => {
        setFulfilledAmount(event.target.value);
    };

    const handleDoneByChange = (event) => {
        setDoneBy(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const requestId = targetRequestId;
        const fulfilledDate = convertDateFormat(Date.now());

        const formData = {
            requestId,
            fulfilledAmount,
            doneBy,
            fulfilledDate,
        };
        console.log('Mark ordered with following info');
        console.log(formData);

        fetch(markOrderedURL.current, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                console.log(`Request ID ${targetRequestId} has been marked as ordered.`);
            } else {
                console.log(`Failed to mark Request ID ${targetRequestId} as ordered...`);
            }
        });

        handleCloseModal();

        if (triggerRefresh !== undefined) {
            setTimeout(() => {
                triggerRefresh();
              }, config.timeout);
        }
    };

    return (
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '95vh', overflow: 'auto', margin: "20px auto" }}>
                    <Stack>
                        <Box>
                            <h2>Mark a Request as Ordered</h2>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Item name'
                                type='text'
                                value={itemDescription}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Catlog number'
                                type='text'
                                value={itemCatalog}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Requested amount'
                                type='text'
                                value={requestAmount}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Fulfilled amount'
                                type='number'
                                value={fulfilledAmount}
                                onChange={handleFulfilledAmountChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Requested by'
                                type='text'
                                value={requestBy}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Fulfilled by'
                                type='text'
                                value={doneBy}
                                onChange={handleDoneByChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <Button 
                                variant="contained" 
                                onClick={handleSubmit} 
                                style={{margin: '0 0 0 0'}}
                            >
                                Mark Fulfilled
                            </Button>
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

MarkInternalRequestFulfilledForm.propTypes = {
    targetRequestId: PropTypes.number.isRequired,
    itemDescription: PropTypes.string,
    itemCatalog: PropTypes.string,
    requestAmount: PropTypes.number,
    requestBy: PropTypes.string,
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
}