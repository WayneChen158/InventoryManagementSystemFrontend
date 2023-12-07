import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import { Box, Card, Grid, Stack, Select, Button, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import { getRawMaterialsURL, updateRawMaterialsURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import { parseMySQLDateStr } from '../utils';

export default function UpdateItemForm({
    materialId,
    handleCloseModal,
    triggerRefresh,
}) {
    const [existingMaterialFetched, setExistingMaterialFetched] = useState(false);

    const [description, setDescription] = useState('');

    const [catalogNumber, setCatalogNumber] = useState('');

    const [manufacturer, setManufacturer] = useState('');

    const [website, setWebsite] = useState('');

    const [groupName, setGroupName] = useState(1);

    const [category, setCategory] = useState(0);

    const [concentration, setConcentration] = useState('');

    const [amountInStock, setAmountInStock] = useState(0);

    const [threshold, setThreshold] = useState(0);

    const [location, setLocation] = useState('');

    const [owner, setOwner] = useState('');

    const [receiveDate, setReceiveDate] = useState('');

    const rawMaterialsURL = useRef(getRawMaterialsURL());

    const updateMaterialURL = useRef(updateRawMaterialsURL());

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleCatalogNumberChange = (e) => {
        setCatalogNumber(e.target.value);
    };

    const handleManufacturerChange = (e) => {
        setManufacturer(e.target.value);
    };

    const handleWebsiteChange = (e) => {
        setWebsite(e.target.value);
    };

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleConcentrationChange = (e) => {
        setConcentration(e.target.value);
    };

    const handleAmountInStockChange = (e) => {
        setAmountInStock(e.target.value);
    };

    const handleThresholdChange = (e) => {
        setThreshold(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleOwnerChange = (e) => {
        setOwner(e.target.value);
    };

    const handleReceiveDateChange = (e) => {
        setReceiveDate(e.target.value);
    };

    useEffect(() => {
        fetch(`${rawMaterialsURL.current}/${materialId}`)
        .then(res => res.json())
        .then(material => {
            console.log(`Fetch for material ${materialId} invoked!`);
            console.log(material);
            if (material !== null && material !== undefined) {
                setExistingMaterialFetched(true);
                setDescription(material.description);
                setCatalogNumber(material.catalogNumber);
                setManufacturer(material.manufacturer);
                setWebsite(material.website === null ? '' : material.website);
                setGroupName(material.groupName);
                setCategory(material.category === null ? 0 : material.category);
                setConcentration(material.concentration === null ? '' : material.concentration);
                setAmountInStock(material.amountInStock);
                setThreshold(material.threshold);
                setLocation(material.location === null ? '' : material.location);
                setOwner(material.owner === null ? '' : material.owner);
                if (material.receiveDate !== null) {
                    setReceiveDate(parseMySQLDateStr(material.receiveDate));
                }
            }
        });
    }, [materialId]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const updateFormData = {
            materialId,
            category,
            groupName,
            catalogNumber,
            description,
            manufacturer,
            concentration,
            receiveDate,
            location,
            owner,
            website,
            threshold,
            amountInStock,
        }
        console.log(`Update material ID ${materialId} as follows`);
        console.log(updateFormData);

        fetch(updateMaterialURL.current, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateFormData),
        })
        .then((response) => {
            if (response.ok) {
                console.log(`Material ID ${materialId} was successfully updated`);
            } else {
                console.log(`Failed to update material ID ${materialId}...`);
            }
        });

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
                            <h2>Update an Existing Inventory Item</h2>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                multiline
                                label="Item description"
                                type='text'
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Catalog number"
                                type='text'
                                value={catalogNumber}
                                onChange={handleCatalogNumberChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Manufacturer"
                                type='text'
                                value={manufacturer}
                                onChange={handleManufacturerChange}
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
                            <FormControl 
                                fullWidth
                            >
                                <InputLabel id="group-name-select">Type</InputLabel>
                                <Select
                                    value={groupName}
                                    lable="Type"
                                    onChange={handleGroupNameChange}
                                >
                                    <MenuItem value={1}>Chemical</MenuItem>
                                    <MenuItem value={2}>Oligo</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <FormControl 
                                fullWidth
                            >
                                <InputLabel id="category-select">Re-sellability</InputLabel>
                                <Select
                                    value={category}
                                    lable="Resellability"
                                    onChange={handleCategoryChange}
                                >
                                    <MenuItem value={0}>Not specified</MenuItem>
                                    <MenuItem value={2}>For re-sale</MenuItem>
                                    <MenuItem value={1}>Not for re-sale</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Concentration"
                                type='number'
                                value={concentration}
                                onChange={handleConcentrationChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Amount in stock"
                                type='number'
                                value={amountInStock}
                                onChange={handleAmountInStockChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Re-stock alert amount"
                                type='number'
                                value={threshold}
                                onChange={handleThresholdChange}
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
                                label="Owner"
                                type='text'
                                value={owner}
                                onChange={handleOwnerChange}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label="Receive date (MM/DD/YYYY)"
                                type='text'
                                value={receiveDate}
                                onChange={handleReceiveDateChange}
                            />
                        </Box>

                        {existingMaterialFetched && (
                            <Box style={{padding: '10px 0 20px 0'}}>
                                <Button variant="contained" onClick={handleUpdate} style={{margin: '0 0 0 0'}}>
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

UpdateItemForm.propTypes = {
    materialId: PropTypes.number.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
}
