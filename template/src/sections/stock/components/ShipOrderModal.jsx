import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Autocomplete, IconButton } from '@mui/material';
import { sellInvoiceURL } from 'src/utils/url-provider'
import Iconify from 'src/components/iconify';

export default function ShipOrderModal({ open, handleClose, productList, componentList, inventoryData }) {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [items, setItems] = useState([]);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const sellInvoiceRef = useRef(sellInvoiceURL());

    const handleAddItem = () => {
        setItems([...items, { uniqueId: '', catalog: '', itemName: '', currentStock: 0, sellQty: 0, category: '', recordId: 0, isEditable: true }]);
    };

    const checkIfSubmitShouldBeDisabled = () => {
        const isInvalid = items.some(item => item.sellQty > item.currentStock || item.sellQty === 0);
        setSubmitDisabled(isInvalid);
      };

    const handleItemSelect = (index, selectedItem) => {
        const isItemAlreadyAdded = items.some(item =>
            item.uniqueId === selectedItem.uniqueId
        );
    
        if (isItemAlreadyAdded) {
            // If the item is already added, don't add it again
            console.warn("Item is already added to the list.");
            return;
        }
        
        const updatedItems = items.map((item, idx) => {
          if (idx === index) {
            // Determine the category and record ID based on the selected item's properties
            let category;
            let recordId;
            if (selectedItem.productRecordId) {
              category = 'product';
              recordId = selectedItem.productRecordId;
            } else if (selectedItem.componentRecordId) {
              category = 'component';
              recordId = selectedItem.componentRecordId;
            } else if (selectedItem.materialId) {
              category = 'inventory';
              recordId = selectedItem.materialId;
            }
      
            return {
              ...item,
              uniqueId: selectedItem.uniqueId,
              catalog: selectedItem.catalogNumber || selectedItem.componentCatalog || selectedItem.productCatalog,
              itemName: selectedItem.productName || selectedItem.componentName || selectedItem.description,
              currentStock: selectedItem.amountInStock,
              category,
              recordId, 
              isEditable: false
            };
          }
          return item;
        });
        setItems(updatedItems);
        checkIfSubmitShouldBeDisabled();
      };
      

    const handleSellQtyChange = (index, qty) => {
        const updatedItems = items.map((item, idx) => {
            if (idx === index) {
                const parsedQty = qty === "" ? 0 : parseInt(qty, 10);
                return { ...item, sellQty: parsedQty };
            }
            return item;
        });
        setItems(updatedItems);
        checkIfSubmitShouldBeDisabled();
    };

    const filterOptions = (options, { inputValue }) => {
        const trimmedInput = inputValue.trim().toLowerCase();

        const availableOptions = options.filter(option =>
            !items.some(item => item.uniqueId === option.uniqueId)
        );

        const filteredOptions = availableOptions.filter(option =>
                (option.productCatalog && typeof option.productCatalog === 'string' && option.productCatalog.toLowerCase().includes(trimmedInput)) ||
                (option.componentCatalog && typeof option.componentCatalog === 'string' && option.componentCatalog.toLowerCase().includes(trimmedInput)) ||
                (option.catalogNumber && typeof option.catalogNumber === 'string' && option.catalogNumber.toLowerCase().includes(trimmedInput))
            );

        return filteredOptions;
    }
  
    const handleDeleteItem = (index) => {
        setItems(items.filter((_, idx) => idx !== index));
        checkIfSubmitShouldBeDisabled();
      };

    const handleSubmit = () => {
        fetch(sellInvoiceRef.current, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Handling the response as text instead of JSON
        })
        .then(data => {
            console.log('Success:', data);
            // You can add any further processing here if needed
        })
        .catch((error) => {
            console.error('There was a problem with the PUT request:', error);
        })
        .finally(() => {
            handleClose();  // Ensure that the modal is closed after processing the request
            setItems([]);
            setInvoiceNumber('');
            setSubmitDisabled(false);
        });
    };
    
    

    const combinedInventoryList = [
        ...productList.map((item, index) => ({ ...item, uniqueId: `P${index}` })),
        ...componentList.map((item, index) => ({ ...item, uniqueId: `C${index}` })),
        ...inventoryData.map((item, index) => ({ ...item, uniqueId: `I${index}` })),
    ];
      

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper style={{ padding: 20, width: '70%', height: '80%', overflowY: 'auto' }}>
                <TextField label="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} fullWidth margin="normal" />

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Catalog#</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Current Stock</TableCell>
                            <TableCell>Sell Qty</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {item.isEditable ? (
                                        <Autocomplete
                                            options={combinedInventoryList}
                                            filterOptions={filterOptions}
                                            getOptionLabel={(option) => `${option.uniqueId} : ${option.productCatalog || option.componentCatalog || option.catalogNumber} | ${option.lotNumber ? option.lotNumber : 'consumable'}`}
                                            isOptionEqualToValue={(option, value) =>
                                                option.uniqueId === value.uniqueId
                                              }
                                            style={{ width: 300 }}
                                            onChange={(event, newValue) => handleItemSelect(index, newValue)}
                                            renderInput={(params) => <TextField {...params} label="Select Catalog#" />}
                                        />
                                    ) : item.catalog}
                                </TableCell>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{item.currentStock}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={Number.isNaN(item.sellQty) ? '' : item.sellQty}
                                        onChange={(e) => handleSellQtyChange(index, parseInt(e.target.value, 10))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDeleteItem(index)}>
                                        <Iconify icon="eva:trash-2-outline" sx={{ color: 'error.main' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Button onClick={handleAddItem}>+ Add Item</Button>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleSubmit} disabled={isSubmitDisabled}>Submit</Button>
                </Box>
            </Paper>
        </Modal>
    );
};

ShipOrderModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    productList: PropTypes.array.isRequired,
    componentList: PropTypes.array.isRequired,
    inventoryData: PropTypes.array.isRequired,
};



  