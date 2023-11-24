import { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, IconButton, MenuItem, Popover, TableCell, TableRow, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function RequestTableRow({
    selected,
    itemDescription,
    project,
    purpose,
    requestAmount,
    pricePerUnit,
    requestBy,
    requestDate,
    handleClick,
}) {
    const [ open, setOpen ] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setOpen(null);
    }

    return(
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell component="th" scope="row" padding="none" align="center">
                    <Typography variant="subtitle2" wrap = "true" width='1/4'>
                        {itemDescription}
                    </Typography>
                </TableCell>

                <TableCell align="center">{project}</TableCell>

                <TableCell align="center">{purpose}</TableCell>

                <TableCell align="center">{requestAmount}</TableCell>

                <TableCell align="center">{pricePerUnit}</TableCell>

                <TableCell align="center">{requestBy}</TableCell>

                <TableCell align="center">{requestDate}</TableCell>

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
                sx: { width: 170 },
                }}
            >
                <MenuItem onClick={handleCloseMenu}>
                    <Iconify icon="eva:shopping-cart-outline" sx={{ mr: 2 }} />
                    Mark Ordered
                </MenuItem>
                
                <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                    Delete Request
                </MenuItem>
            </Popover>
        </>
    );
}

RequestTableRow.propTypes = {
    selected: PropTypes.any,
    itemDescription: PropTypes.any,
    project: PropTypes.any,
    purpose: PropTypes.any,
    requestAmount: PropTypes.any,
    pricePerUnit: PropTypes.any,
    requestBy: PropTypes.any,
    requestDate: PropTypes.any,
    handleClick: PropTypes.func,
}