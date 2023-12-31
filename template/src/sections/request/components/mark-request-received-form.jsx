import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import { Box, Card, Grid, Stack, Select, Button, MenuItem, TextField, InputLabel, FormControl, InputAdornment } from '@mui/material';

import { getRawMaterialsURL, markReceivedRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import { convertDateFormat } from '../utils';

export default function MarkRequestReceivedForm({
    targetRequestId,
    targetMaterialId,
    requestStatus,
    itemDescription,
    itemCatalog,
    vendor,
    orderedAmount,
    prevReceivedAmount,
    unit,
    requestBy,
    comment,
    handleCloseModal,
    triggerRefresh,
}) {
    const markReceivedURL = useRef(markReceivedRequestURL());

    const rawMaterialURL = useRef(getRawMaterialsURL());

    // 1: fully received, 2: partially received
    const [receivingCondition, setReceivingCondition] = useState(1);

    const [receivedAmount, setReceivedAmount] = useState(orderedAmount - prevReceivedAmount);

    const [receivedAmountError, setReceivedAmountError] = useState(false);

    const [receivedAmountErrorMessage, setReceivedAmountErrorMessage] = useState('');

    const [receivedBy, setReceivedBy] = useState('');

    const [inventoryUnit, setInventoryUnit] = useState('');

    const [inboundFactor, setInboundFactor] = useState(1);

    const handelReceivingConditionChange = (event) => {
        const prevState = receivingCondition;
        if (prevState === 1) {
            // Case 1: Transition from fully to partially received
            setReceivedAmount(0);
        } else {
            // Case 2: Transition from partially to fully received
            setReceivedAmount(orderedAmount - prevReceivedAmount);
        }
        setReceivingCondition(event.target.value);
    };

    const handleReceivedAmountChange = (event) => {
        const attemptedReceivedAmount = event.target.value;
        if (orderedAmount - prevReceivedAmount - attemptedReceivedAmount === 0) {
            setReceivedAmountError(true);
            setReceivedAmountErrorMessage("This request should be set as 'Fully Received'");
        } else if (orderedAmount - prevReceivedAmount - attemptedReceivedAmount < 0) {
            setReceivedAmountError(true);
            setReceivedAmountErrorMessage("Received amount cannot exceed remaining amount of this request");
        } else if (attemptedReceivedAmount < 0) {
            setReceivedAmountError(true);
            setReceivedAmountErrorMessage("Received amount cannot cannot be negative...");
        } else {
            setReceivedAmountError(false);
            setReceivedAmountErrorMessage('');
        }
        
        setReceivedAmount(event.target.value);
    };

    const handleReceivedByChange = (event) => {
        setReceivedBy(event.target.value);
    };

    const handleInboundFactorChange = (e) => {
        setInboundFactor(e.target.value);
    };

    const isFormValid = () => (!receivedAmountError && receivedAmount !== 0 && receivedBy !== '');

    // Fetch target raw material info
    useEffect(() => {
        if (targetMaterialId !== null && targetMaterialId !== undefined) {
            fetch(`${rawMaterialURL.current}/${targetMaterialId}`)
            .then(res => res.json())
            .then(rawMaterial => {
                console.log(`Fetch for raw material ${targetMaterialId} invoked!`);
                console.log(rawMaterial);
                if (rawMaterial) {
                    if (rawMaterial.unit) {
                        console.log(rawMaterial.unit);
                        setInventoryUnit(rawMaterial.unit);
                    } else {
                        console.log('EA');
                        setInventoryUnit('EA');
                    }
                }
            });
        }
    }, [targetMaterialId]);
    
    const handleSubmit = (event) => {
        event.preventDefault();

        const requestId = targetRequestId;
        const fulfilledAmount = orderedAmount;
        const receivedDate = convertDateFormat(Date.now());
        const isFullyReceived = receivingCondition;

        const formData = {
            requestId,
            fulfilledAmount,
            receivedAmount,
            unit,
            inboundFactor,
            receivedBy,
            receivedDate,
            isFullyReceived,
        };
        console.log('Mark received with following info');
        console.log(formData);

        fetch(markReceivedURL.current, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                if (receivingCondition === 1) {
                    console.log(`Request ID ${targetRequestId} has been marked as fully received.`);
                } else {
                    console.log(`Request ID ${targetRequestId} has been marked as partially received.`);
                }
            } else {
                console.log(`Failed to mark Request ID ${targetRequestId} as received...`);
            }
        });
        
        handleCloseModal();

        if (triggerRefresh !== undefined) {
            setTimeout(() => {
                triggerRefresh();
              }, config.timeout);
        }
    }

    return (
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '95vh', overflow: 'auto', margin: "20px auto" }}>
                    <Stack>
                        <Box>
                            <h2>Mark a Request as Received</h2>
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
                                label='Vendor'
                                type='text'
                                value={vendor}
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Ordered amount'
                                type='number'
                                value={orderedAmount}
                                InputProps={{ 
                                    readOnly: true,
                                    endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,  
                                }}
                                disabled
                            />
                        </Box>

                        {requestStatus === 3 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label='Previously received amount'
                                    type='number'
                                    value={prevReceivedAmount}
                                    InputProps={{ 
                                        readOnly: true,
                                        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                                    }}
                                    disabled
                                />
                            </Box>
                        )}

                        <Box style={{padding: '10px 0 0 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id='request-category-select'>
                                    Receiving Condition
                                </InputLabel>
                                <Select
                                    value={receivingCondition}
                                    label='Condition'
                                    onChange={handelReceivingConditionChange}
                                >
                                    <MenuItem value={1}>Fully received</MenuItem>
                                    <MenuItem value={2}>Partially received</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {receivingCondition === 1 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label='Received amount'
                                    type='number'
                                    value={orderedAmount - prevReceivedAmount}
                                    InputProps={{ 
                                        readOnly: true,
                                        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,  
                                    }}
                                    disabled
                                />
                            </Box>
                        )}

                        {receivingCondition === 2 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField
                                    required 
                                    label='Received amount'
                                    type='number'
                                    value={receivedAmount}
                                    onChange={handleReceivedAmountChange}
                                    error={receivedAmountError}
                                    helperText={receivedAmountErrorMessage}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>, 
                                    }}
                                />
                            </Box>
                        )}

                        {(targetMaterialId !== null && targetMaterialId !== undefined && unit !== inventoryUnit) && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    required
                                    label='Inbound convention factor'
                                    type='number'
                                    value={inboundFactor}
                                    onChange={handleInboundFactorChange}
                                    helperText={`The request unit "${unit}" is different from the inventory unit "${inventoryUnit}"`}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>{`1 ${unit} = `}</InputAdornment>,
                                        endAdornment: <InputAdornment position='end'>{inventoryUnit}</InputAdornment>,
                                    }}
                                />
                            </Box>
                        )}

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
                                required 
                                label='Received by'
                                type='text'
                                value={receivedBy}
                                onChange={handleReceivedByChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <Button 
                                variant="contained" 
                                onClick={handleSubmit} 
                                style={{margin: '0 0 0 0'}}
                                disabled={!isFormValid()}
                            >
                                {receivingCondition === 1 ? 'Mark Fully Received' : 'Mark Partially Received'}
                            </Button>
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

MarkRequestReceivedForm.propTypes = {
    targetRequestId: PropTypes.number.isRequired,
    targetMaterialId: PropTypes.number,
    requestStatus: PropTypes.number.isRequired,
    itemDescription: PropTypes.string,
    itemCatalog: PropTypes.string,
    vendor: PropTypes.string,
    orderedAmount: PropTypes.number.isRequired,
    prevReceivedAmount: PropTypes.number.isRequired,
    unit: PropTypes.string,
    requestBy: PropTypes.string,
    comment: PropTypes.string,
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
}