import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  selected,
  catalog,
  name,
  date,
  lotNumber,
  amountInStock,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell align="center">
              {catalog}
        </TableCell>

        <TableCell align="center" component="th" scope="row" padding="none">
            <Typography variant="subtitle2" wrap = "true" width='1/4'>
              {name}
            </Typography>
        </TableCell>

        <TableCell align="center">{date ? new Date(date).toLocaleDateString() : 'N/A'}</TableCell>
        
        <TableCell align="center">{lotNumber}</TableCell>

        {/* <TableCell align="center">{location}</TableCell> */}

        <TableCell align="center">{amountInStock}</TableCell>

        {/* <TableCell>
          <Label color={LowInStock === 'Low' ? 'error' : 'info'}>{LowInStock}</Label>
        </TableCell> */}

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
          sell
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Add
        </MenuItem>

      </Popover>
    </>
  );
}

ProductTableRow.propTypes = {
  handleClick: PropTypes.func,
  catalog: PropTypes.any,
  name: PropTypes.any,
  date: PropTypes.any,
  lotNumber: PropTypes.any,
  amountInStock: PropTypes.any,
  selected: PropTypes.any,
};