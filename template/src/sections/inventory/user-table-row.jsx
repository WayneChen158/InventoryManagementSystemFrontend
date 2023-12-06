import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import { Box, Modal } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import NewRequestForm from '../request/components/NewRequestForm';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  materialId,
  name,
  catalog,
  vendor,
  type,
  owner,
  location,
  amountInStock,
  LowInStock,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const [openRequestModal, setOpenRequestModal] = useState(false);

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
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
            <Typography variant="subtitle2" wrap = "true" width='1/4'>
              {name}
            </Typography>
        </TableCell>

        <TableCell>{catalog}</TableCell>
        
        <TableCell>{vendor}</TableCell>

        <TableCell>{type}</TableCell>

        <TableCell align="center">{owner}</TableCell>

        <TableCell align="center">{location}</TableCell>

        <TableCell align="center">{amountInStock}</TableCell>

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
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

        <MenuItem onClick={handleOpenRequestModal}>
          <Iconify icon="mdi:offer"  sx={{ mr: 2 }} />
          Request
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
    </>
  );
}

UserTableRow.propTypes = {
  vendor: PropTypes.any,
  materialId: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  catalog: PropTypes.any,
  owner: PropTypes.any,
  type: PropTypes.any,
  location: PropTypes.any,
  amountInStock: PropTypes.any,
  LowInStock: PropTypes.any,
  selected: PropTypes.any,
};
