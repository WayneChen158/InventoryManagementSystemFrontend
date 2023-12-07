import * as React from 'react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Grid, Stack, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import { addRawMaterialsURL } from 'src/utils/url-provider';

import { config } from 'src/config';

NewItemForm.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
};

export default function NewItemForm({
    handleCloseModal,
    triggerRefresh,
}) {
    
    const [itemName, setItemName] = useState('');
    const [catlogNumber, setCatalogNumber] = useState('');
    const [vendor, setVendor] = useState('');
    const [rawMaterialType, setRawMaterialType] = useState(1);
    const [owner, setOwner] = useState('');
    const [location, setLocation] = useState('');
    const [amount, setAmount] = useState(0);
    const [alertAmount, setAlertAmount] = useState(0);
    const [website, setWebsite] = useState('');

    const addMaterialsURL = useRef(addRawMaterialsURL());

    const handleItemNameChange = (e) => {
        setItemName(e.target.value);
    }

    const handleCatalogNumberChange = (e) => {
        setCatalogNumber(e.target.value);  
    }

    const handleVendorChange = (e) => {
        setVendor(e.target.value);  
    }

    const handleRawMaterialTypeChange = (e) => {
        setRawMaterialType(e.target.value); 
    }

    const handleOwnerChange = (e) => {
        setOwner(e.target.value);  
    }

    const handleLocationChange = (e) => {
        setLocation(e.target.value); 
    }

    const handleAmountChange = (e) => {
        setAmount(e.target.value); 
    }

    const handleAlertAmountChange = (e) => {
        setAlertAmount(e.target.value);
    }

    const handleWebsiteChange = (e) => {
        setWebsite(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const rawMaterialData = {
            itemName,
            catlogNumber,
            vendor,
            rawMaterialType,
            owner,
            location,
            amount,
            alertAmount,
            website,
        };
        console.log("New item to be created:");
        console.log(rawMaterialData);

        fetch(addMaterialsURL.current, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(rawMaterialData)
        })
        .then((response) => {
            if (response.ok) {
                console.log(`New inventory item ${itemName} was successfully created`);
            } else {
                console.log(`Failed to created new inventory item ${itemName}`);
            }
        });

        handleCloseModal();

        if (triggerRefresh !== undefined) {
            setTimeout(() => {
                triggerRefresh();
              }, config.timeout);
        }
    }

    return(
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Stack>
                        <Box>
                            <h2>Add a New Item to the Inventory</h2>
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                multiline
                                label="Item Name"
                                type='text'
                                value={itemName}
                                onChange={handleItemNameChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Catalog Number"
                                type='text'
                                value={catlogNumber}
                                onChange={handleCatalogNumberChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Item URL"
                                type='text'
                                value={website}
                                onChange={handleWebsiteChange}
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
                            <FormControl fullWidth>
                                <InputLabel id='raw-material-type-select'>Type</InputLabel>
                                <Select
                                    value={rawMaterialType}
                                    label='Type'
                                    onChange={handleRawMaterialTypeChange}
                                >
                                    <MenuItem value={1}>Chemical</MenuItem>
                                    <MenuItem value={2}>Oligo</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Owner"
                                type='text'
                                value={owner}
                                onChange={handleOwnerChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Location"
                                type='text'
                                value={location}
                                onChange={handleLocationChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Amount"
                                type='number'
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Alert Amount"
                                type='number'
                                value={alertAmount}
                                onChange={handleAlertAmountChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <Button variant="contained" onClick={handleSubmit} style={{margin: '0 0 0 0'}}>
                                Submit
                            </Button>   
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}