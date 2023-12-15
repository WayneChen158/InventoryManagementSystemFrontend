import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import { Box, Card, Grid, Stack, Select, Button, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import { getRequestsURL } from 'src/utils/url-provider';

import { config } from 'src/config';

export default function UpdateRequestForm({
    requestId,
    handleCloseModal,
    triggerRefresh,
}) {
    const requestsURL = useRef(getRequestsURL());

    const [targetRequestFetched, setTargetRequestFetched] = useState(false);
    
    const [status, setStatus] = useState(0);
    
    const [itemDescription, setItemDescription] = useState("");

    const [itemCatalog, setItemCatalog] = useState("");

    const [itemURL, setItemURL] = useState("");

    const [purpose, setPurpose] = useState(1);

    const [project, setProject] = useState("");

    const [requestAmount, setRequestAmount] = useState(0);

    const [pricePerUnit, setPricePerUnit] = useState(0);

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

    const handlePricePerUnitChange = (e) => {
        setPricePerUnit(e.target.value);
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
                setItemURL(request.itemURL);
                setPurpose(request.purpose);
                setProject(request.project);
                setRequestAmount(request.requestAmount);
                setPricePerUnit(request.pricePerUnit);
            }
        })
    }, [requestId]);

    const handleUpdateRequest = () => {
        handleCloseModal();

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
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Item catalog"
                                type='text'
                                value={itemCatalog}
                                InputProps={{ readOnly: true }}
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
                                />
                            </Box>
                        )}

                        {status !== 1 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label="Amount in stock"
                                    type='number'
                                    value={requestAmount}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>
                        )}

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Unit price"
                                type='number'
                                value={pricePerUnit}
                                onChange={handlePricePerUnitChange}
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