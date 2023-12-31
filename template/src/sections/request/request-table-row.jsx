import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Modal, Dialog, Button, Popover, Checkbox, MenuItem, TableRow, TableCell, IconButton, Typography, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';

import { deleteRequestURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import Iconify from 'src/components/iconify';

import UpdateRequestForm from './components/update-request-form';
import MarkRequestOrderedForm from './components/mark-request-ordered-form';
import MarkRequestReceivedForm from './components/mark-request-received-form';

export default function RequestTableRow({
    status,
    selected,
    requestId,
    materialId,
    itemDescription,
    itemCatalog,
    vendor,
    orderNumber,
    itemURL,
    project,
    purpose,
    requestAmount,
    fulfilledAmount,
    receivedAmount,
    unit,
    pricePerUnit,
    requestBy,
    doneBy,
    receivedBy,
    requestDate,
    fulfilledDate,
    receivedDate,
    comment,
    handleClick,
    triggerRefresh,
}) {
    const [open, setOpen] = useState(null);

    const [openUpdateRequestForm, setOpenUpdateRequestForm] = useState(false);

    const [openMarkOrderedForm, setOpenMarkOrderedForm] = useState(false);

    const [openMarkReceivedForm, setOpenMarkReceivedForm] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const deleteURL = useRef(deleteRequestURL());

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleOpenUpdateRequestModal = () => {
        setOpenUpdateRequestForm(true);
    }

    const handleCloseUpdateRequestModal = () => {
        setOpenUpdateRequestForm(false);
    }

    const handleOpenMarkOrderedModal = () => {
        setOpenMarkOrderedForm(true);
    };
    
    const handleCloseMarkOrderedModal = () => {
        setOpenMarkOrderedForm(false);
    };

    const handleOpenMarkReceivedModal = () => {
        setOpenMarkReceivedForm(true);
    }

    const handleCloseMarkReceivedModal = () => {
        setOpenMarkReceivedForm(false);
    }

    const handleOpenDeleteDialog = () => {
        handleCloseMenu();
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
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

        setTimeout(() => {
            triggerRefresh();
          }, config.timeout);
    };

    const handleMarkRequestOrdered = () => {
        console.log(`Request to mark ordered: ${requestId}`);

        handleCloseMenu();

        handleOpenMarkOrderedModal();
    };

    const handleMarkRequestReceived = () => {
        console.log(`Request to mark received: ${requestId}`);

        handleCloseMenu();

        handleOpenMarkReceivedModal();
    }

    const handleUpdateRequest = () => {
        console.log(`Request to update: ${requestId}`);

        handleCloseMenu();

        handleOpenUpdateRequestModal();
    }

    return(
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                {status !== 4 && (
                    <TableCell align="right">
                        <IconButton onClick={handleOpenMenu}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </TableCell>
                )}

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

                <TableCell align="center">{vendor}</TableCell>

                {status !== 1 && (
                    <TableCell align="center">{orderNumber}</TableCell>
                )}

                {status === 1 && (
                    <TableCell align="center">{project}</TableCell>
                )}
                
                <TableCell align="center">{purpose}</TableCell>

                <TableCell align="center">$ {pricePerUnit}</TableCell>

                <TableCell align="center">{requestAmount} {unit}</TableCell>

                {status !== 1 && (
                    <TableCell align="center">{fulfilledAmount} {unit}</TableCell>
                )}

                {status !== 1 && (
                    <TableCell align="center">
                        {status === 2 ? (`0 ${unit}`) : (`${receivedAmount} ${unit}`)}
                    </TableCell>
                )}

                <TableCell align="center">{requestBy}</TableCell>

                {status !== 1 && (
                    <TableCell align="center">{doneBy}</TableCell>
                )}

                {status !== 1 && (
                    <TableCell align="center">
                        {status === 2 ? ("Not Applicable") : (receivedBy)}
                    </TableCell>
                )}

                <TableCell align="center">{requestDate}</TableCell>

                {status !== 1 && (
                    <TableCell align="center">{fulfilledDate}</TableCell>
                )}

                {status !== 1 && (
                    <TableCell align="center">
                        {status === 2 ? ("Not Applicable") : (receivedDate)}
                    </TableCell>
                )}

                {(status === 2 || status === 3) && (
                    <TableCell align="center">
                        {status === 2 ? "Not Yet Received" : "Partially Received"}
                    </TableCell>
                )}

                <TableCell align="center">{comment}</TableCell>

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
                container={document.getElementById('root')}
            >
                {status !== 4 && (
                    <MenuItem onClick={handleUpdateRequest}>
                        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                        Update Request
                    </MenuItem>
                )}
                
                {status === 1 && (
                    <MenuItem onClick={handleMarkRequestOrdered}>
                        <Iconify icon="eva:shopping-cart-outline" sx={{ mr: 2 }} />
                        Mark Ordered
                    </MenuItem>
                )}

                {status === 1 && (
                    <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
                        <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                        Delete Request
                    </MenuItem>
                )}
                
                {(status === 2 || status === 3) && (
                    <MenuItem onClick={handleMarkRequestReceived}>
                        <Iconify icon="icon-park-outline:receive" sx={{ mr: 2 }} />
                        Mark Received
                    </MenuItem>
                )}
                
            </Popover>

            <Modal
                open={openMarkOrderedForm}
                onClose={handleCloseMarkOrderedModal}
                container={document.getElementById('root')}
            >
                <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
                    <MarkRequestOrderedForm 
                        targetRequestId={requestId}
                        itemDescription={itemDescription}
                        itemCatalog={itemCatalog}
                        unitPrice={pricePerUnit}
                        requestAmount={requestAmount}
                        unit={unit}
                        requestBy={requestBy}
                        handleCloseModal={handleCloseMarkOrderedModal}
                        triggerRefresh={triggerRefresh}
                    />
                </Box>
            </Modal>

            <Modal
                open={openMarkReceivedForm}
                onClose={handleCloseMarkReceivedModal}
                container={document.getElementById('root')}
            >
                <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
                    <MarkRequestReceivedForm 
                        targetRequestId={requestId}
                        targetMaterialId={materialId}
                        requestStatus={status}
                        itemDescription={itemDescription}
                        itemCatalog={itemCatalog}
                        vendor={vendor}
                        orderedAmount={fulfilledAmount}
                        prevReceivedAmount={status === 2 ? 0 : receivedAmount}
                        unit={unit}
                        requestBy={requestBy}
                        doneBy={doneBy}
                        comment={comment}
                        handleCloseModal={handleCloseMarkReceivedModal}
                        triggerRefresh={triggerRefresh}
                    />
                </Box>
            </Modal>

            <Modal
                open={openUpdateRequestForm}
                onClose={handleCloseUpdateRequestModal}
                container={document.getElementById('root')}
            >
                <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
                    <UpdateRequestForm 
                        requestId={requestId}
                        handleCloseModal={handleCloseUpdateRequestModal}
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
                <DialogTitle>Confirm Delete Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the following request?
                        <br />
                        <br />
                        {itemDescription}
                        <br />
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

RequestTableRow.propTypes = {
    status: PropTypes.number.isRequired,
    selected: PropTypes.any,
    requestId: PropTypes.number.isRequired,
    materialId: PropTypes.number,
    itemDescription: PropTypes.string.isRequired,
    itemCatalog: PropTypes.any,
    vendor: PropTypes.string,
    orderNumber: PropTypes.string,
    itemURL: PropTypes.any,
    project: PropTypes.any,
    purpose: PropTypes.any,
    requestAmount: PropTypes.any,
    fulfilledAmount: PropTypes.any,
    receivedAmount: PropTypes.number,
    unit: PropTypes.string,
    pricePerUnit: PropTypes.any,
    requestBy: PropTypes.any,
    doneBy: PropTypes.any,
    receivedBy: PropTypes.string,
    requestDate: PropTypes.any,
    fulfilledDate: PropTypes.any,
    receivedDate: PropTypes.string,
    comment: PropTypes.string,
    handleClick: PropTypes.func,
    triggerRefresh: PropTypes.func.isRequired,
}