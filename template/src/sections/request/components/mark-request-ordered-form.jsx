import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Grid, Stack, Button, TextField, InputAdornment } from '@mui/material';

import { markOrderedRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import { convertDateFormat } from '../utils';

export default function MarkRequestOrderedForm({
    targetRequestId,
    itemDescription,
    itemCatalog,
    unitPrice,
    requestAmount,
    unit,
    requestBy,
    handleCloseModal,
    triggerRefresh,
}) {

    const markOrderedURL = useRef(markOrderedRequestURL());
    
    const [fulfilledAmount, setFulfilledAmount] = useState(requestAmount);

    const [fulfilledAmountError, setFulfilledAmountError] = useState(false);

    const [fulfilledAmountErrorMessage, setFulfilledAmountErrorMessage] = useState("");

    const [orderNumber, setOrderNumber] = useState("");

    const [doneBy, setDoneBy] = useState('');

    const [pricePerUnit, setPricePerUnit] = useState(unitPrice);

    const handleFulfilledAmountChange = (event) => {
        const inputValue = parseFloat(event.target.value);
        if (inputValue <= 0) {
            setFulfilledAmountError(true);
            setFulfilledAmountErrorMessage("Ordered amount must be positive");
        } else if (inputValue !== requestAmount) {
            setFulfilledAmountError(false);
            setFulfilledAmountErrorMessage("Please double-check that a different amount will be ordered");
        } else {
            setFulfilledAmountError(false);
            setFulfilledAmountErrorMessage("");
        }
        setFulfilledAmount(event.target.value);
    };

    const handleOrderNumberChange = (e) => {
        setOrderNumber(e.target.value);
    };

    const handleDoneByChange = (event) => {
        setDoneBy(event.target.value);
    };

    const handlePricePerUnitChange = (event) => {
        setPricePerUnit(event.target.value);
    }

    const isFormValid = () => (fulfilledAmount > 0 && doneBy !== '');

    const handleSubmit = (event) => {
        event.preventDefault();

        const requestId = targetRequestId;
        const fulfilledDate = convertDateFormat(Date.now());

        const formData = {
            requestId,
            fulfilledAmount,
            pricePerUnit,
            doneBy,
            orderNumber,
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
                                multiline
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Catlog number'
                                type='text'
                                value={itemCatalog}
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Requested amount'
                                type='text'
                                value={requestAmount}
                                InputProps={{ 
                                    readOnly: true,
                                    endAdornment: <InputAdornment position="end">{unit}</InputAdornment>, 
                                }}
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                required 
                                label='Fulfilled amount'
                                type='number'
                                value={fulfilledAmount}
                                onChange={handleFulfilledAmountChange}
                                error={fulfilledAmountError}
                                helperText={fulfilledAmountErrorMessage}
                                InputProps={{ 
                                    endAdornment: <InputAdornment position="end">{unit}</InputAdornment>, 
                                }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label='Unit price'
                                type='number'
                                value={pricePerUnit}
                                onChange={handlePricePerUnitChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                                }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Requested by'
                                type='text'
                                value={requestBy}
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label='PO number'
                                type='text'
                                value={orderNumber}
                                onChange={handleOrderNumberChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                required 
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
                                disabled={!isFormValid()}
                            >
                                Mark Ordered
                            </Button>
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

MarkRequestOrderedForm.propTypes = {
    targetRequestId: PropTypes.number.isRequired,
    itemDescription: PropTypes.string,
    itemCatalog: PropTypes.string,
    unitPrice: PropTypes.number,
    requestAmount: PropTypes.number,
    unit: PropTypes.string,
    requestBy: PropTypes.string,
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
}