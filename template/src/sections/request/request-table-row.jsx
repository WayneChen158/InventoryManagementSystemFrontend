import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Popover, Checkbox, MenuItem, TableRow, TableCell, IconButton, Typography } from '@mui/material';

import { deleteRequestURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import { config } from '../../config';

export default function RequestTableRow({
    selected,
    requestId,
    itemDescription,
    itemCatalog,
    itemURL,
    project,
    purpose,
    requestAmount,
    pricePerUnit,
    requestBy,
    requestDate,
    handleClick,
    triggerRefresh,
}) {
    const [ open, setOpen ] = useState(null);

    const deleteURL = useRef(deleteRequestURL());

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setOpen(null);
    }

    const handleDeleteRequest = () => {
        console.log(`Request to delete: ${requestId}`);
        
        fetch(`${deleteURL.current}/${requestId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Request ID ${requestId} has been successfully deleted`);
                } else {
                    console.log(`Failed to delete request ID ${requestId}...`);
                }
            });
        
        handleCloseMenu();

        setTimeout(() => {
            triggerRefresh();
          }, config.timeout);
    }

    return(
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell component="th" scope="row" padding="none" align="center">
                    <Typography variant="subtitle2" wrap = "true" width='1/4'>
                        {(itemURL === null || itemURL === "") ? (
                            itemDescription
                        ) : (
                            <a href={itemURL} target='_blank' rel="noreferrer">{itemDescription}</a>    
                        )}
                    </Typography>
                </TableCell>

                <TableCell align="center">{itemCatalog}</TableCell>
                
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
                
                <MenuItem onClick={handleDeleteRequest} sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                    Delete Request
                </MenuItem>
            </Popover>
        </>
    );
}

RequestTableRow.propTypes = {
    selected: PropTypes.any,
    requestId: PropTypes.number.isRequired,
    itemDescription: PropTypes.string.isRequired,
    itemCatalog: PropTypes.any,
    itemURL: PropTypes.any,
    project: PropTypes.any,
    purpose: PropTypes.any,
    requestAmount: PropTypes.any,
    pricePerUnit: PropTypes.any,
    requestBy: PropTypes.any,
    requestDate: PropTypes.any,
    handleClick: PropTypes.func,
    triggerRefresh: PropTypes.func.isRequired,
}