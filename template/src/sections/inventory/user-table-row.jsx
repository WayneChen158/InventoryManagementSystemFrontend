import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import { Box, Modal, Dialog, Button, Popover, TableRow, Checkbox, MenuItem, TableCell, Typography, IconButton, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';

import { deleteRawMaterialsURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import UpdateItemForm from './components/update-item-form';
import NewRequestForm from '../request/components/NewRequestForm';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  materialId,
  name,
  website,
  catalog,
  vendor,
  type,
  owner,
  location,
  amountInStock,
  unit,
  LowInStock,
  handleClick,
  triggerRefresh,
}) {
  const [open, setOpen] = useState(null);

  const [openRequestModal, setOpenRequestModal] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const deleteMaterialURL = useRef(deleteRawMaterialsURL());

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenRequestModal = () => {
    setOpen(null);
    setOpenRequestModal(true);
  };

  const handleCloseRequestModal = () => {
    setOpenRequestModal(false);
  };

  const handleOpenUpdateModal = () => {
    setOpen(null);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  }

  const handleOpenDeleteDialog = () => {
    handleCloseMenu();
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRawMaterial = () => {
    console.log(`Request to delete: ${materialId}`);

    fetch(`${deleteMaterialURL.current}/${materialId}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    })
    .then((response) => {
      if (response.ok) {
        console.log(`Material ID ${materialId} has been successfully deleted`);
      } else {
        console.log(`Failed to delete material ID ${materialId}...`);
      }
    });

    handleCloseDeleteDialog();

    if (triggerRefresh !== undefined) {
      setTimeout(() => {
        triggerRefresh();
      }, config.timeout);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
            <Typography variant="subtitle2" wrap = "true" width='1/4'>
              {(website === null || website === "") ? (
                name
              ) : (
                <a href={website} target='_blank' rel="noreferrer">{name}</a>
              )}
            </Typography>
        </TableCell>

        <TableCell>{catalog}</TableCell>
        
        <TableCell>{vendor}</TableCell>

        <TableCell>{type}</TableCell>

        <TableCell align="center">{owner}</TableCell>

        <TableCell align="center">{location}</TableCell>

        <TableCell align="center">{amountInStock} {(unit === undefined || unit === "") ? "EA" : unit}</TableCell>

        <TableCell>
          <Label color={LowInStock === 'Low' ? 'error' : 'info'}>{LowInStock}</Label>
        </TableCell>

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
        container={document.getElementById('root')}
      >
        <MenuItem onClick={handleOpenRequestModal}>
          <Iconify icon="mdi:offer"  sx={{ mr: 2 }} />
          Request
        </MenuItem>
        
        <MenuItem onClick={handleOpenUpdateModal}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Update
        </MenuItem>

        <MenuItem 
          onClick={handleOpenDeleteDialog} 
          sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Modal
        open={openRequestModal}
        onClose={handleCloseRequestModal}
        container={document.getElementById('root')}
      >
        <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
          <NewRequestForm 
            handleCloseModal={handleCloseRequestModal}
            inventoryItems={[]}
            candidateItemDescription={name}
            candidateItemCatalog={catalog}
            candidateMaterialId={materialId}
          />
        </Box>
      </Modal>

      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        container={document.getElementById('root')}
      >
        <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
          <UpdateItemForm
            handleCloseModal={handleCloseUpdateModal} 
            materialId={materialId}
            triggerRefresh={triggerRefresh}
          />
        </Box>
      </Modal>

      {/* Delete Comfirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        container={document.getElementById('root')}
      >
        <DialogTitle>Confirm Delete Raw Material</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the following raw material? 
            <br />
            <br />
            {name}
            <br />
            <br /> 
            This action is irreversible!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRawMaterial} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  vendor: PropTypes.any,
  materialId: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  website: PropTypes.string,
  catalog: PropTypes.any,
  owner: PropTypes.any,
  type: PropTypes.any,
  location: PropTypes.any,
  amountInStock: PropTypes.any,
  unit: PropTypes.string,
  LowInStock: PropTypes.any,
  selected: PropTypes.any,
  triggerRefresh: PropTypes.func,
};
