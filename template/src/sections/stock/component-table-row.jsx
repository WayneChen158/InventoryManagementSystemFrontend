import { useState} from 'react';
import PropTypes from 'prop-types';

import { Popover, TableRow, MenuItem, TableCell, Typography, IconButton } from '@mui/material';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  catalog: PropTypes.any,
  name: PropTypes.any,
  lotNumber: PropTypes.any,
  amountInStock: PropTypes.any,
  unit: PropTypes.any,
};

export default function ProductTableRow({
  catalog,
  name,
  lotNumber,
  amountInStock,
  unit,
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
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell />

        <TableCell align="center">
              {catalog}
        </TableCell>

        <TableCell align="center" component="th" scope="row" padding="none">
            <Typography variant="subtitle2" wrap = "true" width='1/4'>
              {name}
            </Typography>
        </TableCell>

        <TableCell align="center">{lotNumber}</TableCell>

        <TableCell align="center">{amountInStock} {unit}</TableCell>


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
          edit
        </MenuItem>

      </Popover>
    </>
  );
}