import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import {
    Box, Modal, Card, Typography, IconButton, Table, TableHead,
    TableRow, TableCell, TableBody, TableContainer, TextField, Autocomplete, InputAdornment, Button, Checkbox
} from '@mui/material';

import { getInvoiceDetailsURL, getConsumablesURL, getProductsInStockURL, getComponentsInStockURL,
    addInvoiceContentURL, updateInvoiceContentURL, deleteInvoiceContentURL, shipInvoiceURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

InvoiceDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  invoice: PropTypes.any,
  page: PropTypes.string
};

export default function InvoiceDetailsModal({ open, handleClose, invoice, page }) {
  const [editMode, setEditMode] = useState({});
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState({ sku: '', description: '', amount: '', category: '', uniqueID: '' });
  const [checkedItems, setCheckedItems] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // const [invoiceContents, setInvoiceContents] = useState([]);
  const getInvoiceDetailsRequestURL = useRef(getInvoiceDetailsURL());

  const [productList, setProductList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const productsInStockURL = useRef(getProductsInStockURL());
  const componentsInStockURL = useRef(getComponentsInStockURL());
  const consumablesURL = useRef(getConsumablesURL());

  const addInvoiceContentPOSTURL = useRef(addInvoiceContentURL());
  const updateInvoiceContentPUTURL = useRef(updateInvoiceContentURL());
  const deleteInvoiceContentDELETEURL = useRef(deleteInvoiceContentURL());
  const shipInvoicePUTURL = useRef(shipInvoiceURL());

  const [refreshTrigger, setRefreshTrigger] = useState(1);
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev * (-1));
  }

  useEffect(() => {
    if (open) {
      fetch(`${getInvoiceDetailsRequestURL.current}/${invoice.invoiceId}`)
        .then(response => response.json())
        .then(data => {
            // setInvoiceContents(data);
            setContents(data);
        })
        .catch(error => console.error('Error fetching invoice details:', error));
    }
  }, [open,refreshTrigger, invoice.invoiceId]);

  useEffect(() => {
    fetch(productsInStockURL.current, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        console.log(resdata);
        setProductList(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [refreshTrigger]);

  useEffect(() => {
    fetch(componentsInStockURL.current, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        console.log(resdata);
        setComponentList(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [refreshTrigger]);

  useEffect(() => {
    fetch(consumablesURL.current)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setInventoryData(data);
    })
  }, [refreshTrigger]);

  const handleEdit = (id) => {
    setEditMode({ ...editMode, [id]: true });
  };

  const handleCancelEdit = (id) => {
    setEditMode({ ...editMode, [id]: false });
  };

  const handleUpdate = (id, updatedContent) => {
    // Make PUT request to update the content
    fetch(`${updateInvoiceContentPUTURL.current}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContent),
    })
    .then(response => response.ok ? console.log('Content updated successfully') : console.error('Failed to update content'))
    .catch(error => console.error('Error updating content:', error));

    setEditMode({ ...editMode, [id]: false });
    setContents(contents.map(content => content.invoiceContentID === id ? updatedContent : content));
  };

  const handleDelete = (id) => {
    // Make DELETE request to delete the content
    fetch(`${deleteInvoiceContentDELETEURL.current}/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.ok ? console.log('Content deleted successfully') : console.error('Failed to delete content'))
    .catch(error => console.error('Error deleting content:', error));

    setContents(contents.filter(content => content.invoiceContentID !== id));
  };

  const handleAddNewRow = () => {
    // Make POST request to add new content
    fetch(`${addInvoiceContentPOSTURL.current}/${invoice.invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add new content');
      }
      return {};
    })
    .then(data => {
      setContents([...contents, { ...newContent, invoiceContentID: data.invoiceContentID }]);
      setNewContent({ sku: '', description: '', amount: '', category: '', uniqueID: '' });
      triggerRefresh();
    })
    .catch(error => console.error('Error adding new content:', error));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = [
      ...productList.filter(item => item.productCatalog.includes(query)),
      ...componentList.filter(item => item.componentCatalog.includes(query)),
      ...inventoryData.filter(item => item.catalogNumber.includes(query))
    ];
    setSearchResults(results);
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

  const handleShipInvoice = () => {
    // Make PUT request to ship the invoice
    fetch(`${shipInvoicePUTURL.current}/${invoice.invoiceId}`, {
      method: 'PUT',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to ship invoice');
      }
      console.log('Invoice shipped successfully');
      triggerRefresh();
      handleClose();
    })
    .catch(error => console.error('Error shipping invoice:', error));
  };

  const handleCheckboxChange = (id, checked) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }));
  };

  const allChecked = contents.every(content => checkedItems[content.invoiceContentID]);


  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <Card sx={{ width: '70%', padding: '20px', position: 'relative' }}>
          <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ position: 'absolute', top: 0, left: 0 }}
              sx={{ padding: 2 }}
          >
              <Iconify icon="material-symbols:close" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ marginTop: 4, marginBottom: 4 }}>
            Invoice Details: {invoice.invoiceNumber}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {page === 'unshipped' && <TableCell />}
                  <TableCell>SKU</TableCell>
                  <TableCell>Description (Lot Number)</TableCell>
                  <TableCell>Qty</TableCell>
                  {page === 'unshipped' && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={`${content.invoiceContentID}`}>
                    {page === 'unshipped' && (
                        <TableCell>
                          <Checkbox
                            checked={checkedItems[content.invoiceContentID] || false}
                            onChange={(e) => handleCheckboxChange(content.invoiceContentID, e.target.checked)}
                          />
                        </TableCell>
                      )}
                    {editMode[content.invoiceContentID] ? (
                      <>
                        <TableCell>
                          <TextField
                            value={content.sku}
                            onChange={(e) => setContents(contents.map(c => c.invoiceContentID === content.invoiceContentID ? { ...c, sku: e.target.value } : c))}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={content.description}
                            onChange={(e) => setContents(contents.map(c => c.invoiceContentID === content.invoiceContentID ? { ...c, description: e.target.value } : c))}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={content.amount}
                            onChange={(e) => setContents(contents.map(c => c.invoiceContentID === content.invoiceContentID ? { ...c, amount: e.target.value } : c))}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleUpdate(content.invoiceContentID, content)}>
                            <Iconify icon="eva:checkmark-circle-2-outline" />
                          </IconButton>
                          <IconButton onClick={() => handleCancelEdit(content.invoiceContentID)}>
                            <Iconify icon="eva:close-circle-outline" />
                          </IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{content.sku}</TableCell>
                        <TableCell>{content.description}</TableCell>
                        <TableCell>{content.amount}</TableCell>
                        {page === 'unshipped' && (
                          <TableCell>
                            <IconButton onClick={() => handleEdit(content.invoiceContentID)}>
                              <Iconify icon="eva:edit-outline" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(content.invoiceContentID)}>
                              <Iconify icon="eva:trash-2-outline" />
                            </IconButton>
                          </TableCell>
                        )}
                      </>
                    )}
                  </TableRow>
                ))}
                {page === 'unshipped' && (
                  <TableRow>
                    <TableCell/>
                    <TableCell>
                    <Autocomplete
                        options={[...productList, ...componentList, ...inventoryData]}
                        getOptionLabel={(option) => `${option.productCatalog || option.componentCatalog || option.catalogNumber} || ${option.lotNumber}`}
                        onInputChange={(event, value) => handleSearch(value)}
                        onChange={(event, value) => handleSelectSearchResult(value)}
                        renderOption={(props, option) => (
                          <li {...props} 
                            key={`${option.catalogNumber || option.componentCatalog || option.productCatalog}
                            _${option.productRecordId || option.componentRecordId || option.materialId}`}>
                            {option.productCatalog || option.componentCatalog || option.catalogNumber} || {option.lotNumber}
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
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {page === 'unshipped' && (<Button
            variant="contained"
            color="primary"
            disabled={!allChecked}
            onClick={handleShipInvoice}
            sx={{ marginTop: 2 }}
          >
            Ship this Invoice
          </Button>)}
        </Card>
      </Box>

    </Modal>
  );
}

