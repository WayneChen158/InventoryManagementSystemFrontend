import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import { Box, Card, Grid, Stack, Select, Button, MenuItem, TextField, InputLabel, FormControl, InputAdornment } from '@mui/material';

import { getRequestsURL, updateRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

export default function UpdateRequestForm({
    requestId,
    handleCloseModal,
    triggerRefresh,
}) {
    const requestsURL = useRef(getRequestsURL());

    const updateURL = useRef(updateRequestURL());

    const [targetRequestFetched, setTargetRequestFetched] = useState(false);
    
    const [status, setStatus] = useState(0);
    
    const [itemDescription, setItemDescription] = useState("");

    const [itemCatalog, setItemCatalog] = useState("");

    const [vendor, setVendor] = useState('');

    const [itemURL, setItemURL] = useState("");

    const [purpose, setPurpose] = useState(1);

    const [project, setProject] = useState("");

    const [requestAmount, setRequestAmount] = useState(0);

    const [fulfilledAmount, setFulfilledAmount] = useState(0);

    const [pricePerUnit, setPricePerUnit] = useState(0);

    const [unit, setUnit] = useState('');

    const [comment, setComment] = useState('');

    const handleVendorChange = (e) => {
        setVendor(e.target.value);
    };
    
    const handleItemURLChange = (e) => {
        setItemURL(e.target.value);
    };

    const handlePurposeChange = (e) => {
        setPurpose(e.target.value);
    };

    const handleProjectChange = (e) => {
        setProject(e.target.value);
    }

    const handleRequestAmountChange = (e) => {
        setRequestAmount(e.target.value);
    };

    const handleFulfilledAmountChange = (e) => {
        setFulfilledAmount(e.target.value);
    };

    const handlePricePerUnitChange = (e) => {
        setPricePerUnit(e.target.value);
    };

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    useEffect(() => {
        fetch(`${requestsURL.current}/${requestId}`)
        .then(res => res.json())
        .then(request => {
            console.log(`Fetch for request ${requestId} invoked!`);
            console.log(request);
            if (request) {
                setTargetRequestFetched(true);
                setStatus(request.status);
                setItemDescription(request.itemDescription);
                setItemCatalog(request.itemCatalog);
                setVendor(request.vendor);
                setItemURL(request.itemURL);
                setPurpose(request.purpose);
                setProject(request.project);
                setRequestAmount(request.requestAmount);
                setFulfilledAmount(request.fulfilledAmount === null ? 0 : request.fulfilledAmount);
                setPricePerUnit(request.pricePerUnit);
                setUnit(request.unit);
                setComment(request.comment);
            }
        })
    }, [requestId]);

    const handleUpdateRequest = (e) => {
        e.preventDefault();
        
        handleCloseModal();

        const formData = {
            requestId,
            vendor,
            itemURL,
            purpose,
            project,
            requestAmount,
            fulfilledAmount,
            pricePerUnit,
            unit,
            comment,
        }
        console.log(`Update request ID ${requestId} as follows`);
        console.log(formData);

        fetch(updateURL.current, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                console.log(`Request ID ${requestId} was successfully updated`);
            } else {
                console.log(`Failed to update request ID ${requestId}...`);
            }
        });

        if (triggerRefresh !== undefined) {
            setTimeout(() => {
                triggerRefresh();
              }, config.timeout);
        }
    };

    return(
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '95vh', overflow: 'auto', margin: "20px auto" }}>
                    <Stack>
                        <Box>
                            <h2>Update an Existing Request</h2>
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                multiline
                                label="Item description"
                                type='text'
                                value={itemDescription}
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Item catalog"
                                type='text'
                                value={itemCatalog}
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Vendor"
                                type='text'
                                value={vendor}
                                onChange={handleVendorChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Item URL"
                                type='text'
                                value={itemURL}
                                onChange={handleItemURLChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <FormControl 
                                fullWidth
                            >
                                <InputLabel id="group-name-select">Purpose</InputLabel>
                                <Select
                                    value={purpose}
                                    lable="Purpose"
                                    onChange={handlePurposeChange}
                                >
                                    <MenuItem value={1}>R&D</MenuItem>
                                    <MenuItem value={2}>MFG</MenuItem>
                                    <MenuItem value={3}>Re-sale</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Project"
                                type='text'
                                value={project}
                                onChange={handleProjectChange}
                            />
                        </Box>

                        {status === 1 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label="Request amount"
                                    type='number'
                                    value={requestAmount}
                                    onChange={handleRequestAmountChange}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                                    }}
                                />
                            </Box>
                        )}

                        {status !== 1 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label="Request amount"
                                    type='number'
                                    value={requestAmount}
                                    InputProps={{ readOnly: true }}
                                    disabled
                                />
                            </Box>
                        )}

                        {status === 2 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label="Ordered amount"
                                    type='number'
                                    value={fulfilledAmount}
                                    onChange={handleFulfilledAmountChange}
                                />
                            </Box>
                        )}

                        {status === 3 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label="Ordered amount"
                                    type='number'
                                    value={fulfilledAmount}
                                    InputProps={{ readOnly: true }}
                                    disabled
                                />
                            </Box>
                        )}

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Unit price"
                                type='number'
                                value={pricePerUnit}
                                onChange={handlePricePerUnitChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Unit"
                                type='text'
                                value={unit}
                                onChange={handleUnitChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Comment"
                                type='text'
                                value={comment}
                                onChange={handleCommentChange}
                                multiline
                            />
                        </Box>

                        {targetRequestFetched && (
                            <Box style={{padding: '10px 0 20px 0'}}>
                                <Button variant="contained" onClick={handleUpdateRequest} style={{margin: '0 0 0 0'}}>
                                    Update
                                </Button>   
                            </Box>
                        )}
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

UpdateRequestForm.propTypes = {
    requestId: PropTypes.number.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
}