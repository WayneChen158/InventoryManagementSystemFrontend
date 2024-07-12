// InvoiceEditForm.jsx
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Modal, Card, Typography, IconButton, TextField, Button
} from '@mui/material';

import { updateInvoiceURL } from 'src/utils/url-provider';

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

export default function InvoiceEditForm({ open, handleClose, invoice, triggerRefresh }) {
  const [invoiceNumber, setInvoiceNumber] = useState(invoice.invoiceNumber);
  const [url, setUrl] = useState(invoice.url);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [shipDate, setShipDate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState(invoice.trackingNumber);

  const updateInvoicePUTURL = useRef(updateInvoiceURL());

  useEffect(() => {
    if (invoice.invoiceDate) {
      setInvoiceDate(formatDate(invoice.invoiceDate));
    }
    if (invoice.shipDate) {
      setShipDate(formatDate(invoice.shipDate));
    }
  }, [invoice]);

  const handleUpdate = () => {
    const updatedInvoice = {
      invoiceID: invoice.invoiceId,
      invoiceNumber,
      url,
      invoiceDate: invoiceDate ? new Date(invoiceDate).toISOString() : null,
      shipDate: shipDate ? new Date(shipDate).toISOString() : null,
      trackingNumber
    };

    fetch(updateInvoicePUTURL.current, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedInvoice)
    })
    .then(response => {
      if (response.ok) {
        console.log('Invoice updated successfully');
        handleClose();
        triggerRefresh();
      } else {
        console.log('Failed to update invoice');
      }
    })
    .catch(error => console.error('Error updating invoice:', error));
  };

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
        <Card sx={{ width: '50%', padding: 3, position: 'relative' }}>
          <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ position: 'absolute', top: 0, left: 0 }}
              sx={{ padding: 2 }}
          >
              <Iconify icon="material-symbols:close" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ marginTop: 2, marginBottom: 4 }}>
            Invoice Information about {invoice.invoiceNumber}
          </Typography>
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
            onChange={(e) => setInvoiceDate(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Ship Date"
            type="date"
            value={shipDate}
            onChange={(e) => setShipDate(e.target.value)}
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
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </Card>
      </Box>
    </Modal>
  );
}

InvoiceEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  invoice: PropTypes.shape({
    invoiceId: PropTypes.string.isRequired,
    invoiceNumber: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    invoiceDate: PropTypes.string.isRequired,
    shipDate: PropTypes.string,
    trackingNumber: PropTypes.string,
  }).isRequired,
  triggerRefresh: PropTypes.func,
};