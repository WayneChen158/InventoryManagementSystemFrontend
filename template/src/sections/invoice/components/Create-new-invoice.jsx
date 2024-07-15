import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import {
  Box, Card, Grid, Modal, Table, Button, TableRow, TableHead, TableCell, 
  TextField, TableBody, Typography, IconButton, Autocomplete, TableContainer, InputAdornment
} from '@mui/material';

import { getCustomersURL, createInvoiceURL, getConsumablesURL, getProductsInStockURL, getComponentsInStockURL, 
   } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

// Function to format date as YYYY-MM-DD in local time
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return ''; // Check for invalid date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function InvoiceCreateForm({ open, handleClose, triggerRefresh }) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [url, setUrl] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState({ sku: '', description: '', amount: '', category: '', uniqueID: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const createInvoicePOSTURL = useRef(createInvoiceURL());
  const productsInStockURL = useRef(getProductsInStockURL());
  const componentsInStockURL = useRef(getComponentsInStockURL());
  const consumablesURL = useRef(getConsumablesURL());

  const [productList, setProductList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetch(getCustomersURL())
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  useEffect(() => {
    fetch(productsInStockURL.current, { method: 'GET' })
      .then(response => response.json())
      .then(resdata => setProductList(resdata))
      .catch(error => console.error('Error fetching products in stock:', error));
  }, []);

  useEffect(() => {
    fetch(componentsInStockURL.current, { method: 'GET' })
      .then(response => response.json())
      .then(resdata => setComponentList(resdata))
      .catch(error => console.error('Error fetching components in stock:', error));
  }, []);

  useEffect(() => {
    fetch(consumablesURL.current)
      .then(response => response.json())
      .then(data => setInventoryData(data))
      .catch(error => console.error('Error fetching consumables:', error));
  }, []);

  const handleAddNewRow = () => {
    setContents([...contents, { ...newContent, invoiceContentID: Date.now() }]);
    setNewContent({ sku: '', description: '', amount: '', category: '', uniqueID: '' });
  };

  const handleDeleteRow = (id) => {
    setContents(contents.filter(content => content.invoiceContentID !== id));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = [
      ...productList.filter(item => item.productCatalog.includes(query)),
      ...componentList.filter(item => item.componentCatalog.includes(query)),
      ...inventoryData.filter(item => item.catalogNumber.includes(query))
    ];
    setSearchResults(results);
    console.log(searchQuery);
    console.log(searchResults);
  };

  const handleSelectSearchResult = (item) => {
    let selectedContent = {};
    if (productList.includes(item)) {
      selectedContent = { category: 'p', uniqueID: item.productRecordId, sku: item.productCatalog, description: item.lotNumber, amount: '' };
    } else if (componentList.includes(item)) {
      selectedContent = { category: 'c', uniqueID: item.componentRecordId, sku: item.componentCatalog, description: item.lotNumber, amount: '' };
    } else if (inventoryData.includes(item)) {
      selectedContent = { category: 'r', uniqueID: item.materialId, sku: item.catalogNumber, description: item.description, amount: '' };
    }
    setNewContent(selectedContent);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCreateInvoice = () => {
    const newInvoice = {
      invoiceNumber,
      url,
      invoiceDate: invoiceDate ? new Date(invoiceDate).toISOString() : null,
      trackingNumber,
      customerID: selectedCustomer?.id,
    };

    const invoiceItems = contents.map(content => ({
      sku: content.sku,
      description: content.description,
      amount: content.amount,
      category: content.category,
      uniqueID: content.uniqueID
    }));

    const createInvoiceForm = {
      invoiceDAO: newInvoice,
      invoiceItemDAOs: invoiceItems
    };

    console.log(createInvoiceForm);
    console.log(selectedCustomer.customerId);

    fetch(`${createInvoicePOSTURL.current}/${selectedCustomer.customerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createInvoiceForm)
    })
      .then(response => {
        if (response.ok) {
          console.log('Invoice created successfully');
          triggerRefresh();
          handleClose();
        } else {
          console.log('Failed to create invoice');
        }
      })
      .catch(error => console.error('Error creating invoice:', error));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          overflow: 'auto' 
        }}
      >
        <Card sx={{ width: '70%', padding: 3, position: 'relative', maxHeight: '90vh', overflow: 'auto' }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: 'absolute', top: 8, right: 8 }}
            sx={{ padding: 2 }}
          >
            <Iconify icon="material-symbols:close" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ marginTop: 2, marginBottom: 4 }}>
            Create Invoice
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Invoice Date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(formatDate(e.target.value))}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => `${option.customerName} (${option.phoneNumber} ${option.emailAddress})`}
                onChange={(event, value) => setSelectedCustomer(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Search Customer" variant="outlined" />
                )}
                sx={{ marginBottom: 2 }}
              />
              {selectedCustomer && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body1"><strong>Company:</strong> {selectedCustomer.company}</Typography>
                  <Typography variant="body1"><strong>Customer Name:</strong> {selectedCustomer.customerName}</Typography>
                  <Typography variant="body1"><strong>Phone Number:</strong> {selectedCustomer.phoneNumber}</Typography>
                  <Typography variant="body1"><strong>Shipping Address:</strong> {selectedCustomer.shipAddress}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Typography variant="h6" component="div" sx={{ marginTop: 4, marginBottom: 2 }}>
            Invoice Contents
          </Typography>
          <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Add</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content.invoiceContentID}>
                    <TableCell>{content.sku}</TableCell>
                    <TableCell>{content.description}</TableCell>
                    <TableCell>{content.amount}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteRow(content.invoiceContentID)}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Autocomplete
                      options={[...productList, ...componentList, ...inventoryData]}
                      getOptionLabel={(option) => `${option.productCatalog || option.componentCatalog || option.catalogNumber} - ${option.lotNumber}`}
                      onInputChange={(event, value) => handleSearch(value)}
                      onChange={(event, value) => handleSelectSearchResult(value)}
                      renderOption={(props, option) => (
                        <li {...props} key={`${option.catalogNumber || option.componentCatalog || option.productCatalog}_${option.productRecordId || option.componentRecordId || option.materialId}`}>
                          {option.productCatalog || option.componentCatalog || option.catalogNumber} - {option.lotNumber}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="New SKU"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Iconify icon="eva:search-outline" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={newContent.description}
                      onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                      placeholder="New Description"
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={newContent.amount}
                      onChange={(e) => setNewContent({ ...newContent, amount: e.target.value })}
                      placeholder="New Qty"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleAddNewRow}>
                      <Iconify icon="eva:plus-circle-outline" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="contained" onClick={handleCreateInvoice}>
              Create
            </Button>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}

InvoiceCreateForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  triggerRefresh: PropTypes.func,
};





