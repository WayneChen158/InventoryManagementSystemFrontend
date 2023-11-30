import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { cancelManufactureTaskURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import { config } from '../../../config';
import RecipeCard from './popupRecipeCard';
import ScaleCheckBox from './ScaleCheckBox';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  record,
  status,
  handleClick,
  handleOperation,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const cancelManufactureTask = useRef(cancelManufactureTaskURL());

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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

  const handleCancelTask = () => {
    fetch(`${cancelManufactureTask.current}/${record.manufactureRecordId}`, {
        method: 'PUT',
    }).then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    }).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
    setAnchorEl(null);
    setTimeout(() => {
      handleOperation();
    }, config.timeout);
  }

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

        {status === 1 && <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>}
      </TableRow>

      {status === 1 && <Popover
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

        <MenuItem onClick={handleCancelTask} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

      </Popover>}

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
              handleOperation={handleOperation}
            />
          </Box>
        </Modal>
    </>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  record: PropTypes.any,
  status: PropTypes.any,
  selected: PropTypes.any,
  handleOperation: PropTypes.any,
};
