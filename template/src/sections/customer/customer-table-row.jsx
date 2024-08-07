import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Stack, Modal, Table, Button, Popover, Collapse, TableRow,
  MenuItem, TableCell, TableBody, Typography, IconButton } from '@mui/material';

import { deleteCustomerURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import InvoiceTableRow from 'src/sections/invoice/invoice-table-row'
import InvoiceTableHead from 'src/sections/invoice/invoice-table-head'

import CustomerForm from './components/customer-form';

// ----------------------------------------------------------------------

export default function CustomerTableRow({
  selected,
  customer,
  triggerRefresh
}) {
  const [expand, setExpand] = useState(false);
  
  const [open, setOpen] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteCustomer = useRef(deleteCustomerURL());

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenModal = () => {
    handleCloseMenu();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    // Assuming deleteCustomerURL is a function that returns the delete URL for a given customer ID
    const deleteCustomerRequestURL = `${deleteCustomer.current}/${customer.customerId}`;

    fetch(deleteCustomerRequestURL, {
      method: 'DELETE',
    })
    .then((response) => {
      if (response.ok) {
        console.log(`Customer ${customer.customerName} was successfully deleted`);
        triggerRefresh();
      } else {
        console.log(`Failed to delete customer ${customer.customerName}`);
      }
    })
    .catch((error) => {
      console.error('There was a problem with the delete operation:', error);
    });

    setConfirmDelete(false);
    handleCloseMenu();
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setExpand(!expand)}
          >
            {expand ? <Iconify icon="solar:alt-arrow-down-bold" /> : <Iconify icon="solar:alt-arrow-right-bold" />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="left" spacing={2}>
            <Typography variant="subtitle2">
              {customer.customerName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{customer.company}</TableCell>

        <TableCell align="left">{customer.phoneNumber}</TableCell>

        <TableCell align="left">{customer.emailAddress}</TableCell>

        <TableCell align="left">{customer.shipAddress}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order History
              </Typography>
              <Table size="small" aria-label="purchases">
                <InvoiceTableHead
                  order={null}
                  orderBy={null}
                  onRequestSort={null}
                  headLabel={[
                    { id: 'invoiceNumber', label: 'Invoice#' },
                    { id: 'invoiceDate', label: 'Invoice Date' },
                    { id: 'shipDate', label: 'Ship Date' },
                    { id: 'trackingNumber', label: 'Tracking' },
                  ]}
                />
                <TableBody>
                  {customer.invoices.map((historyRow) => (
                    <InvoiceTableRow
                      key={historyRow.invoiceId}
                      invoice={historyRow}
                      page='customerEnd'
                      handleOperation={triggerRefresh}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpenModal}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh'
          }}
        >
          <Card style={{ width: '70%', padding: '20px' }}>
            <CustomerForm 
              currentInfo={customer}
              handleCloseModal={handleCloseModal}
              triggerRefresh={triggerRefresh}
            />
          </Card>
        </Box>
      </Modal> 

      <Modal
        open={confirmDelete}
        onClose={handleCancelDelete}
      >
        <Box 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh'
          }}
        >
          <Card style={{ width: '400px', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Confirm Deletion
            </Typography>
            <Typography variant="body2" gutterBottom>
              Are you sure you want to delete this customer?
            </Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                Confirm
              </Button>
              <Button variant="contained" onClick={handleCancelDelete}>
                No
              </Button>
            </Box>
          </Card>
        </Box>
      </Modal>
    </>
  );
}

CustomerTableRow.propTypes = {
  customer: PropTypes.any,
  selected: PropTypes.any,
  triggerRefresh: PropTypes.func
};
