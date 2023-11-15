import { format } from 'date-fns'
import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import Label from 'src/components/label';

import Iconify from 'src/components/iconify';

import RecipeCard from './popupRecipeCard';
import ScaleCheckBox from './ScaleCheckBox';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  record,
  handleClick,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // const [open, setOpen] = useState(null);

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const formatDate = (dateString) => {
    const formattedDate = format(new Date(dateString), 'yyyy-MM-dd');
    return formattedDate;
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openCheckModal, setOpenCheckModal] = useState(false);
  const handleOpenCheckModal = () => {
    handleCloseMenu();
    setOpenCheckModal(true);
  };
  const handleCloseCheckModal = () => {
    setOpenCheckModal(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell align="center" component="th" scope="row" padding="none">
              {record && record.manufactureRecordId}
        </TableCell>

        <TableCell align="center" component="th" scope="row" padding="none">
              {record && record.componentName}
        </TableCell>

        <TableCell align="center">{record && formatDate(record.manufactureDate)}</TableCell>

        <TableCell align="center">{record && record.owner}</TableCell>

        <TableCell align="center">{record && record.scale}</TableCell>

        <TableCell align="center">
          <Button onClick={handleOpenModal}>Show Recipe</Button>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            container={document.getElementById('root')}
          >
            <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '60%', height: '100%'}}>
              <RecipeCard data={record.recordDetails} />
            </Box>
          </Modal>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleOpenCheckModal} sx={{ color: 'success.main' }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Done
        </MenuItem>

        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

      </Popover>

      <Modal
          open={openCheckModal}
          onClose={handleCloseCheckModal}
          container={document.getElementById('root')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '50%', height: '40%'}}>
            <ScaleCheckBox 
              handleCloseCheckModal={handleCloseCheckModal}
              scale={record && record.scale}
              manufactureRecordId = {record.manufactureRecordId}
            />
          </Box>
        </Modal>
    </>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  record: PropTypes.any,
  selected: PropTypes.any,
};
