import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import { Button, TableRow, TableCell, Typography, IconButton } from '@mui/material';

import { deleteInvoiceURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import InvoiceEditForm from './components/invoice-edit-form';
import InvoiceDetailModal from './components/invoice-detail-modal';
import ConfirmationModal from './components/delete-confirmation-modal';

// ----------------------------------------------------------------------

export default function InvoiceTableRow({
  invoice,
  page,
  handleOperation
}) {
  const [open, setOpen] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteInvoiceRequestURL = useRef(deleteInvoiceURL());

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    handleOperation();
    setOpenModal(false);
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
    handleCloseMenu();
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
    handleCloseMenu();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleDelete = () => {
    fetch(`${deleteInvoiceRequestURL.current}/${invoice.invoiceId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        console.log('Invoice deleted successfully');
        handleOperation();
      } else {
        console.error('Failed to delete invoice');
      }
      handleCloseDeleteModal();
    })
    .catch(error => console.error('Error deleting invoice:', error));
  };

  return (
    <>
      <TableRow>

        <TableCell align="left">
          {invoice.url ? (
            <Link href={invoice.url} underline="none" target="_blank" rel="noopener noreferrer">
              <Typography variant="subtitle2" noWrap>
                {invoice.invoiceNumber}
              </Typography>
            </Link>
          ) : (
            <Typography variant="subtitle2" noWrap>
              {invoice.invoiceNumber}
            </Typography>
          )}
        </TableCell>

        <TableCell align="left">{formatDate(invoice.invoiceDate)}</TableCell>

        <TableCell align="left">{formatDate(invoice.shipDate)}</TableCell>

        <TableCell align="left">
          {invoice.trackingNumber ? (
            <Link
              href={
                invoice.trackingNumber.match(/[A-Za-z]/)
                  ? `https://www.ups.com/track?track=yes&trackNums=${invoice.trackingNumber}&loc=en_US&requester=ST/`
                  : `https://www.fedex.com/fedextrack/?tracknumbers=${invoice.trackingNumber}`
              }
              underline="none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography noWrap>
                {invoice.trackingNumber}
              </Typography>
            </Link>
          ) : (
            <Typography noWrap>
              {invoice.trackingNumber}
            </Typography>
          )}
        </TableCell>

        <TableCell align="right">
          <Button variant="text" onClick={handleOpenModal}>
            Show Details
          </Button>
        </TableCell>

        <InvoiceDetailModal
          open={openModal}
          handleClose={handleCloseModal}
          invoice={invoice}
          page={page}
        />

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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
        <MenuItem onClick={handleOpenEditModal}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpenDeleteModal} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

      </Popover>

      <InvoiceEditForm
        open={openEditModal}
        handleClose={handleCloseEditModal}
        invoice={invoice}
        triggerRefresh = {handleOperation}
      />

      <ConfirmationModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={handleDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice?"
      />

    </>
  );
}

InvoiceTableRow.propTypes = {
  invoice: PropTypes.any,
  page: PropTypes.string,
  handleOperation: PropTypes.func,
};
