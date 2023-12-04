import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Modal, Dialog, Button, Popover, Checkbox, MenuItem, TableRow, TableCell, IconButton, Typography, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';

import { deleteRequestURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import { config } from '../../config';
import MarkInternalRequestFulfilledForm from './components/mark-internal-request-fulfilled-form';

export default function RequestInternalTableRow({
    statusCode,
    selected,
    requestId,
    itemDescription,
    itemCatalog,
    project,
    requestAmount,
    fulfilledAmount,
    requestBy,
    doneBy,
    requestDate,
    fulfilledDate,
    handleClick,
    triggerRefresh,
}) {
    const [open, setOpen] = useState(null);

    const [openMarkFulfilledForm, setOpenMarkFulfilledForm] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const deleteURL = useRef(deleteRequestURL());

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleOpenMarkFulfilledModal = () => {
        setOpenMarkFulfilledForm(true);
    };
    
    const handleCloseMarkFulfilledModal = () => {
        setOpenMarkFulfilledForm(false);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        handleCloseMenu();
    };

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
        
        handleCloseDeleteDialog();
        
        handleCloseMenu();

        setTimeout(() => {
            triggerRefresh();
          }, config.timeout);
    };

    const handleMarkFulfilledRequest = () => {
        console.log(`Internal request to mark fulfilled: ${requestId}`);

        handleCloseMenu();

        handleOpenMarkFulfilledModal();
    };

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

                <TableCell align="center">{itemCatalog}</TableCell>
                
                <TableCell align="center">{project}</TableCell>

                <TableCell align="center">{requestAmount}</TableCell>

                {statusCode === 2 ? (
                    <TableCell align="center">{fulfilledAmount}</TableCell>
                ) : null}

                <TableCell align="center">{requestBy}</TableCell>

                {statusCode === 2 ? (
                    <TableCell align="center">{doneBy}</TableCell>
                ) : null}

                <TableCell align="center">{requestDate}</TableCell>

                {statusCode === 2 ? (
                    <TableCell align="center">{fulfilledDate}</TableCell>
                ) : null}

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
                {statusCode === 1 ? (
                    <MenuItem onClick={handleMarkFulfilledRequest}>
                        <Iconify icon="eva:shopping-cart-outline" sx={{ mr: 2 }} />
                        Mark Filfilled
                    </MenuItem>
                ) : null}

                {statusCode === 1 ? (
                    <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
                        <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                        Delete Request
                    </MenuItem>
                ) : null}
                
                {statusCode === 2 ? (
                    <MenuItem onClick={handleCloseMenu}>
                        <Iconify icon="icon-park-outline:receive" sx={{ mr: 2 }} />
                        Mark Received
                    </MenuItem>
                ) : null}
                
            </Popover>

            <Modal
                open={openMarkFulfilledForm}
                onClose={handleCloseMarkFulfilledModal}
                container={document.getElementById('root')}
            >
                <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
                    <MarkInternalRequestFulfilledForm
                        targetRequestId={requestId}
                        itemDescription={itemDescription}
                        itemCatalog={itemCatalog}
                        requestAmount={requestAmount}
                        requestBy={requestBy}
                        handleCloseModal={handleCloseMarkFulfilledModal}
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
            >
                <DialogTitle>Confirm Delete Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your request for {itemDescription}?
                        <br /> 
                        This action is irreversible!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteRequest} color="error">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

RequestInternalTableRow.propTypes = {
    statusCode: PropTypes.number.isRequired,
    selected: PropTypes.any,
    requestId: PropTypes.number.isRequired,
    itemDescription: PropTypes.string.isRequired,
    itemCatalog: PropTypes.any,
    project: PropTypes.any,
    requestAmount: PropTypes.any,
    fulfilledAmount: PropTypes.any,
    requestBy: PropTypes.any,
    doneBy: PropTypes.any,
    requestDate: PropTypes.any,
    fulfilledDate: PropTypes.any,
    handleClick: PropTypes.func,
    triggerRefresh: PropTypes.func.isRequired,
}