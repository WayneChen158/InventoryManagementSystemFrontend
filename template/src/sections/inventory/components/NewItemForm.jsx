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

    const [amountError, setAmountError] = useState(false);

    const [amountErrorMessage, setAmountErrorMessage] = useState("");
    
    const [alertAmount, setAlertAmount] = useState(0);

    const [alertAmountError, setAlertAmountError] = useState(false);

    const [alertAmountErrorMessage, setAlertAmountErrorMessage] = useState("");
    
    const [website, setWebsite] = useState('');

    const addMaterialsURL = useRef(addRawMaterialsURL());

    const handleItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const handleCatalogNumberChange = (e) => {
        setCatalogNumber(e.target.value);  
    };

    const handleVendorChange = (e) => {
        setVendor(e.target.value);  
    };

    const handleRawMaterialTypeChange = (e) => {
        setRawMaterialType(e.target.value); 
    };

    const handleOwnerChange = (e) => {
        setOwner(e.target.value);  
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value); 
    };

    const handleAmountChange = (e) => {
        const inputAmount = parseFloat(e.target.value);
        if (inputAmount < 0) {
            setAmountError(true);
            setAmountErrorMessage("Amount value must be positive...");
        } else {
            setAmountError(false);
            setAmountErrorMessage("");
        }
        
        setAmount(e.target.value); 
    };

    const handleAlertAmountChange = (e) => {
        const inputAmount = parseFloat(e.target.value);
        if (inputAmount < 0) {
            setAlertAmountError(true);
            setAlertAmountErrorMessage("Alert threshold value must be positive...");
        } else if (inputAmount >= parseFloat(amount)) {
            setAlertAmountError(true);
            setAlertAmountErrorMessage("Alert threhold amount cannot equate or exceed stock amount");
        } else {
            setAlertAmountError(false);
            setAlertAmountErrorMessage("");
        }
        setAlertAmount(e.target.value);
    };

    const handleWebsiteChange = (e) => {
        setWebsite(e.target.value);
    };

    const isFormValid = () => (
        itemName !== "" &&
        catlogNumber !== "" &&
        vendor !== "" && 
        amount !== 0 &&
        amount !== '0' &&
        amount !== "" &&
        alertAmount < amount
    );

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
                                required
                                multiline
                                label="Item Name"
                                type='text'
                                value={itemName}
                                onChange={handleItemNameChange}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                required
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
                                required
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
                                required
                                label="Amount"
                                type='number'
                                value={amount}
                                onChange={handleAmountChange}
                                error={amountError}
                                helperText={amountErrorMessage}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                label="Alert Amount"
                                type='number'
                                value={alertAmount}
                                onChange={handleAlertAmountChange}
                                error={alertAmountError}
                                helperText={alertAmountErrorMessage}
                            />
                        </Box>
                        <Box style={{padding: '10px 0 0 0'}}>
                            <Button 
                                variant="contained" 
                                onClick={handleSubmit} 
                                style={{margin: '0 0 0 0'}}
                                disabled={!isFormValid()}
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