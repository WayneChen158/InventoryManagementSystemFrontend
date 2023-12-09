import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Grid, Stack, Radio, Button, Select, MenuItem, TextField, FormLabel, RadioGroup, InputLabel, FormControl, Autocomplete, InputAdornment, FormControlLabel } from '@mui/material';

import { addRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

export default function NewRequestForm({
    handleCloseModal,
    triggerRefresh,
    complete,
    formType,
    inventoryItems,
    candidateItemDescription,
    candidateItemCatalog,
    candidateItemAmount,
    candidateMaterialId,
    internalComponents,
    internalComponentRecords,
    internalProducts,    
    internalProductRecords,
}) {
    const [itemDescription, setItemDescription] = useState(candidateItemDescription === undefined ? '' : candidateItemDescription);

    const [catalogNumber, setCatalogNumber] = useState(candidateItemCatalog === undefined ? '' : candidateItemCatalog);

    const [itemURL, setItemURL] = useState('');

    const [requestPurpose, setRequestPurpose] = useState(1);

    const [project, setProject] = useState('');

    const [requestAmount, setRequestAmount] = useState(candidateItemAmount === undefined ? 0 : candidateItemAmount);

    const [requestAmountError, setRequestAmountError] = useState(false);

    const [requestAmountMessage, setRequestAmountMessage] = useState("");

    const [pricePerUnit, setPricePerUnit] = useState(0.0);

    const [requestBy, setRequestBy] = useState('');

    const [requestCategory, setRequestCategory] = useState((formType === undefined) || (formType === 'purchase') ? '1' : '2');

    const [materialId, setMaterialId] = useState(candidateMaterialId === undefined ? null : candidateMaterialId);

    const [componentRecordId, setComponentRecordId] = useState(null);

    const [productRecordId, setProductRecordId] = useState(null);

    const [madeInternalItemSelection, setMadeInternalItemSelection] = useState(false);

    const [madeInternalLotSelection, setMadeInternalLotSelection] = useState(false);

    const [internalLotNumber, setInternalLotNumber] = useState("");

    const [internalLotAvailableAmount, setInternalLotAvailableAmount] = useState(0);

    const [internalRecordOptions, setInternalRecordOptions] = useState([]);

    const addNewRequestURL = useRef(addRequestURL());
    
    const handleItemDescriptionChange = (event) => {
        setItemDescription(event.target.value);
    };
    
    const handleCatalogNumberChange = (event) => {
        setCatalogNumber(event.target.value);
    };

    const handleItemURLChange = (event) => {
        setItemURL(event.target.value);
    };

    const handleRequestPurposeChange = (event) => {
        setRequestPurpose(event.target.value);
    };

    const handleProjectChange = (event) => {
        setProject(event.target.value);
    };

    const handleRequestAmountChange = (event) => {
        const inputAmount = event.target.value;
        if (parseFloat(inputAmount) < 0) {
            setRequestAmountError(true);
            setRequestAmountMessage("Request amount must be positive...");
        } else if (inputAmount === '') {
            setRequestAmountError(true);
            setRequestAmountMessage("Please input a request amount");
        } else if (requestCategory === '2') {
            console.log(inputAmount);
            if (parseFloat(inputAmount) > internalLotAvailableAmount) {
                setRequestAmountError(true);
                setRequestAmountMessage("Request amount cannot exceed lot available amount");
            } else {
                setRequestAmountError(false);
                setRequestAmountMessage("");
            }
        } else {
            setRequestAmountError(false);
            setRequestAmountMessage("");
        }
        setRequestAmount(event.target.value);
    };

    const handlePricePerUnitChange = (event) => {
        setPricePerUnit(event.target.value);
    };

    const handleRequestByChange = (event) => {
        setRequestBy(event.target.value);
    };

    const handleRequestCategoryChange = (event) => {
        setRequestCategory(event.target.value);
        setItemDescription('');
        setCatalogNumber('');
        setItemURL('');
        setRequestPurpose(1);
        setProject('');
        setRequestAmount(0);
        setMaterialId(null);
        setComponentRecordId(null);
        setProductRecordId(null);
        setMadeInternalItemSelection(false);
        setInternalRecordOptions([]);
        setInternalLotNumber("");
        setMadeInternalLotSelection(false);
        setInternalLotAvailableAmount(0);
        setRequestAmountError(false);
        setRequestAmountMessage("");
    };

    const combineItems = () => {
        const combinedItems = [
            ...(internalProducts || []),
            ...(internalComponents || []),
            // ...(inventoryItems || []),
          ];
        return combinedItems;
    };

    const getAutocompleteLabel = (item) => {
        if ('materialId' in item) {
            return `[Raw Material] ${item.description}`;
        }
        if ('componentId' in item) {
            return `[Component] ${item.componentName}`;
        }
        if ('productId' in item) {
            return `[Product] ${item.productName}`;
        }
        return 'Unknown';
    }

    const getInternalRecordOptions = (selectedItem) => {
        let options = []
        if ('componentId' in selectedItem) {
            options = internalComponentRecords.filter(item => item.componentCatalog === selectedItem.componentCatalog);
        } else if ('productId' in selectedItem) {
            options = internalProductRecords.filter(item => item.productCatalog === selectedItem.productCatalog);
        }
        options.push({
            amountInStock: Infinity,
            lotNumber: "Request New Lot"
        });
        console.log(options);
        return options;
    }

    const handleAutocompleteDescriptionChange = (_, selectedItem) => {
        console.log("Selected existing inventory item:")
        console.log(selectedItem);
        if (selectedItem) {
            if ('materialId' in selectedItem) {
                setMaterialId(selectedItem.materialId);
                if (selectedItem.catalogNumber !== null) {
                    setCatalogNumber(selectedItem.catalogNumber);
                }
                if (selectedItem.website !== null) {
                    setItemURL(selectedItem.website);
                }
                if (selectedItem.threshold !== null) {
                    setRequestAmount(selectedItem.threshold);
                }
            } else if ('componentId' in selectedItem) {
                setMadeInternalItemSelection(true);
                setCatalogNumber(selectedItem.componentCatalog);
                const componentRecordOptions = getInternalRecordOptions(selectedItem);
                setInternalRecordOptions(componentRecordOptions);
            } else if ('productId' in selectedItem) {
                setMadeInternalItemSelection(true);
                setCatalogNumber(selectedItem.productCatalog);
                const productRecordOptions = getInternalRecordOptions(selectedItem);
                setInternalRecordOptions(productRecordOptions);
            }
        } else {
            setCatalogNumber('');
            setItemURL('');
            setRequestAmount(0);
            setMadeInternalItemSelection(false);
            setInternalRecordOptions([]);
            setInternalLotNumber("");
            setMadeInternalLotSelection(false);
            setInternalLotAvailableAmount(0);
        }
    };

    const handleAutocompleteInternalLotChange = (_, selectedLot) => {
        console.log("Selected the following lot:");
        console.log(selectedLot);
        if (selectedLot) {
            setMadeInternalLotSelection(true);
            setInternalLotNumber(selectedLot.lotNumber);
            setInternalLotAvailableAmount(selectedLot.amountInStock);
            if ('productRecordId' in selectedLot) {
                setProductRecordId(selectedLot.productRecordId);
            } else {
                setComponentRecordId(selectedLot.componentRecordId);
            }
        } else {
            setMadeInternalLotSelection(false);
            setInternalLotNumber("");
            setInternalLotAvailableAmount(0);
        }
    }

    const convertDateFormat = (timestamp) => {
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const isFormValid = () => (
        !requestAmountError
        && requestAmount !== 0
        && requestAmount !== '0'
        && itemDescription !== ""
        && catalogNumber !== ""
        && requestBy !== ""  
    );
 
    const handleSubmit = (event) => {
        event.preventDefault();

        const purpose = requestPurpose;
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
            materialId,
            componentRecordId,
            productRecordId,
        }
        console.log("Request form data")
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
        
        
        if (triggerRefresh !== undefined) {
            setTimeout(() => {
                triggerRefresh();
              }, config.timeout);
        }
    };

    return(
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Stack>
                        <Box>
                            <h2>Add a New Request</h2>
                        </Box>

                        {complete && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <FormControl>
                                    <FormLabel>Request Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={requestCategory}
                                        onChange={handleRequestCategoryChange}
                                    >
                                        <FormControlLabel
                                            value='1'
                                            control={<Radio />}
                                            label="Purchase"
                                        />
                                        <FormControlLabel
                                            value='2'
                                            control={<Radio />}
                                            label="Internal"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        )}

                        {requestCategory === '1' && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                {candidateItemDescription === undefined ? (
                                    <Autocomplete
                                        freeSolo
                                        options={inventoryItems}
                                        getOptionLabel={(option) => option.description}
                                        inputValue={itemDescription}
                                        onInputChange={(_, newInputValue) => setItemDescription(newInputValue)}
                                        onChange={handleAutocompleteDescriptionChange}
                                        renderInput={(params) => (
                                        <TextField {...params} label="Item name" variant="outlined" fullWidth multiline required />
                                        )}
                                    />
                                ) : (
                                    <TextField
                                        label='Item name'
                                        type='text'
                                        value={itemDescription}
                                        onChange={handleItemDescriptionChange}
                                    />
                                )}
                            </Box>
                        )}

                        {requestCategory === '2' && (
                            <Autocomplete
                                options={combineItems()}
                                getOptionLabel={(option) => getAutocompleteLabel(option)}
                                inputValue={itemDescription}
                                onInputChange={(_, newInputValue) => setItemDescription(newInputValue)}
                                onChange={handleAutocompleteDescriptionChange}
                                renderInput={(params) => (
                                <TextField {...params} label="Item name" variant="outlined" fullWidth required />
                                )}
                            />
                        )}
    
                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                required 
                                label='Catlog number'
                                type='text'
                                value={catalogNumber}
                                onChange={handleCatalogNumberChange}
                            />
                        </Box>

                        {requestCategory === '2' && madeInternalItemSelection && (
                            <Autocomplete 
                                options={internalRecordOptions}
                                getOptionLabel={(option) => 
                                    (`Lot ${internalRecordOptions.indexOf(option)+1}: ${option.lotNumber}`)}
                                inputValue={internalLotNumber}
                                onChange={handleAutocompleteInternalLotChange}
                                onInputChange={(_, newInputValue) => setInternalLotNumber(newInputValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Lot number" variant='outlined' fullWidth/>
                                )}
                            />
                        )}

                        {requestCategory === '1' && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label='URL'
                                    type='text'
                                    value={itemURL}
                                    onChange={handleItemURLChange}
                                />
                            </Box>
                        )}

                        <Box style={{padding: '10px 0 0 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id='request-category-select'>
                                    Purpose
                                </InputLabel>
                                <Select 
                                    value={requestPurpose}
                                    label='Purpose'
                                    onChange={handleRequestPurposeChange}
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

                        {requestCategory === '2' 
                            && madeInternalItemSelection 
                            && madeInternalLotSelection 
                            && internalLotAvailableAmount !== Infinity 
                            && (
                                <Box style={{padding: '10px 0 0 0'}}>
                                    <TextField
                                        label='Lot available amount'
                                        type='number'
                                        value={internalLotAvailableAmount} 
                                        InputProps={{ readOnly: true }}
                                    />
                                </Box>
                            )}

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField
                                required 
                                label='Request amount'
                                type='number'
                                value={requestAmount}
                                onChange={handleRequestAmountChange}
                                error={requestAmountError}
                                helperText={requestAmountMessage}
                            />
                        </Box>

                        {requestCategory === '1' && (
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
                        )}

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Requester'
                                type='text'
                                value={requestBy}
                                onChange={handleRequestByChange}
                                required
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

NewRequestForm.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
    complete: PropTypes.bool,
    formType: PropTypes.string,
    inventoryItems: PropTypes.array,
    candidateItemDescription: PropTypes.string,
    candidateItemCatalog: PropTypes.string,
    candidateItemAmount: PropTypes.number,
    candidateMaterialId: PropTypes.number,
    internalComponents: PropTypes.array,
    internalComponentRecords: PropTypes.array,
    internalProducts: PropTypes.array,
    internalProductRecords: PropTypes.array,
}