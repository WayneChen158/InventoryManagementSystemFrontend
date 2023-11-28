import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Autocomplete, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ShipOrderModal({ open, handleClose, productList, componentList, inventoryData }) {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [items, setItems] = useState([]);

    const handleAddItem = () => {
        setItems([...items, { catalog: '', itemName: '', currentStock: 0, sellQty: 0, isEditable: true }]);
    };

    const handleItemSelect = (index, selectedItem) => {
        const updatedItems = items.map((item, idx) => {
            if (idx === index) {
                return { ...item, 
                    catalog: selectedItem.catalogNumber || selectedItem.componentCatalog || selectedItem.productCatalog, 
                    itemName: selectedItem.productName || selectedItem.componentName || selectedItem.description, 
                    currentStock: selectedItem.amountInStock, 
                    isEditable: true };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleSellQtyChange = (index, qty) => {
        const updatedItems = items.map((item, idx) => {
            if (idx === index) {
                return { ...item, sellQty: qty };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleDeleteItem = (index) => {
        setItems(items.filter((_, idx) => idx !== index));
    };

    const handleSubmit = () => {
        // Process data and make API call to update backend
        handleClose();
    };

    const combinedInventoryList = [...productList, ...componentList, ...inventoryData];

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
                                            getOptionLabel={(option) => `${option.productCatalog || option.componentCatalog || option.catalogNumber} | ${option.lotNumber ? option.lotNumber : null}`}
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
                                        value={item.sellQty}
                                        onChange={(e) => handleSellQtyChange(index, parseInt(e.target.value, 10))}
                                        disabled={!item.isEditable}
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
                    <Button onClick={handleSubmit}>Submit</Button>
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



  