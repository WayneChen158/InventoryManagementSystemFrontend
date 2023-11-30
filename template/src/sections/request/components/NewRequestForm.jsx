import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Grid, Stack, Button, Select, MenuItem, TextField, InputLabel, FormControl, Autocomplete, InputAdornment } from '@mui/material';

import { addRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

export default function NewRequestForm({
    handleCloseModal,
    triggerRefresh,
    inventoryItems,    
}) {
    const [itemDescription, setItemDescription] = useState('');

    const [catalogNumber, setCatalogNumber] = useState('');

    const [itemURL, setItemURL] = useState('');

    const [requestCategory, setRequestCategory] = useState(1);

    const [project, setProject] = useState('');

    const [requestAmount, setRequestAmount] = useState(0);

    const [pricePerUnit, setPricePerUnit] = useState(0.0);

    const [requestBy, setRequestBy] = useState('');

    const addNewRequestURL = useRef(addRequestURL());

    const handleCatalogNumberChange = (event) => {
        setCatalogNumber(event.target.value);
    }

    const handleItemURLChange = (event) => {
        setItemURL(event.target.value);
    }

    const handleRequestCategoryChange = (event) => {
        setRequestCategory(event.target.value);
    }

    const handleProjectChange = (event) => {
        setProject(event.target.value);
    }

    const handleRequestAmountChange = (event) => {
        setRequestAmount(event.target.value);
    }

    const handlePricePerUnitChange = (event) => {
        setPricePerUnit(event.target.value);
    }

    const handleRequestByChange = (event) => {
        setRequestBy(event.target.value);
    }

    const handleAutocompleteChange = (_, selectedItem) => {
        console.log("Selected existing inventory item:")
        console.log(selectedItem);
        if (selectedItem) {
            if (selectedItem.catalogNumber !== null) {
                setCatalogNumber(selectedItem.catalogNumber);
            }
            if (selectedItem.website !== null) {
                setItemURL(selectedItem.website);
            }
            if (selectedItem.threshold !== null) {
                setRequestAmount(selectedItem.threshold);
            }
        } else {
            setCatalogNumber('');
            setItemURL('');
            setRequestAmount(0);
        }
        
    }

    const convertDateFormat = (timestamp) => {
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }
 
    const handleSubmit = (event) => {
        event.preventDefault();

        const purpose = requestCategory;
        const timestamp = Date.now();
        const requestDate = convertDateFormat(timestamp);

        const requestData = {
            itemDescription,
            catalogNumber,
            itemURL,
            requestCategory,
            project,
            purpose,
            requestAmount,
            pricePerUnit,
            requestBy,
            requestDate,
        }
        console.log(requestData);

        fetch(addNewRequestURL.current, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestData)
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Request for ${itemDescription} has been successfully recorded!`);
                } else {
                    console.log(`Failed to record request for ${itemDescription}...`);
                }
            });

        handleCloseModal();
        
        setTimeout(() => {
            triggerRefresh();
          }, config.timeout);
    }

    return(
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Stack>
                        <Box>
                            <h2>Add a new request</h2>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                        <Autocomplete
                            freeSolo
                            options={inventoryItems}
                            getOptionLabel={(option) => option.description}
                            inputValue={itemDescription}
                            onInputChange={(_, newInputValue) => setItemDescription(newInputValue)}
                            onChange={handleAutocompleteChange}
                            renderInput={(params) => (
                            <TextField {...params} label="Item name" variant="outlined" fullWidth />
                            )}
                        />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Catlog number'
                                type='text'
                                value={catalogNumber}
                                onChange={handleCatalogNumberChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='URL'
                                type='text'
                                value={itemURL}
                                onChange={handleItemURLChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id='request-category-select'>
                                    Purpose
                                </InputLabel>
                                <Select 
                                    value={requestCategory}
                                    label='Purpose'
                                    onChange={handleRequestCategoryChange}
                                >
                                    <MenuItem value={1}>R&D</MenuItem>
                                    <MenuItem value={2}>Manufacture</MenuItem>
                                    <MenuItem value={3}>Re-sale</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Project'
                                type='text'
                                value={project}
                                onChange={handleProjectChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Amount'
                                type='number'
                                value={requestAmount}
                                onChange={handleRequestAmountChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Price per unit'
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
                                label='Requester'
                                type='text'
                                value={requestBy}
                                onChange={handleRequestByChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <Button 
                                variant="contained" 
                                onClick={handleSubmit} 
                                style={{margin: '0 0 0 0'}}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

NewRequestForm.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func.isRequired,
    inventoryItems: PropTypes.array,
}