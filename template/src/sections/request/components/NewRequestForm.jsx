import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Grid, Stack, Button, Select, MenuItem, TextField, InputLabel, FormControl, InputAdornment } from '@mui/material';

export default function NewRequestForm({handleCloseModal}) {
    
    const [itemDescription, setItemDescription] = useState('');

    const [catalogNumber, setCatalogNumber] = useState('');

    const [itemURL, setItemURL] = useState('');

    const [requestCategory, setRequestCategory] = useState(1);

    const [project, setProject] = useState('');

    const [requestAmount, setRequestAmount] = useState(0);

    const [pricePerUnit, setPricePerUnit] = useState(0.0);

    const [requestBy, setRequestBy] = useState('');

    const handleItemDescriptionChange = (event) => {
        setItemDescription(event.target.value);
    }

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

    // TODO
    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(itemDescription);
        console.log(catalogNumber);
        console.log(itemURL);
        console.log(requestCategory);
        console.log(project);
        console.log(requestAmount);
        console.log(pricePerUnit);
        console.log(requestBy);

        handleCloseModal();
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
                            <TextField 
                                label='Item name'
                                type='text'
                                value={itemDescription}
                                onChange={handleItemDescriptionChange}
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
}