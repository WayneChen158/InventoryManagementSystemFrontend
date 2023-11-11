import { useState } from 'react';
import PropTypes from 'prop-types';

import {  Box, Card, Stack,  Modal, Button, TextField, Typography } from '@mui/material';

export default function ScaleCheckBox({ handleCloseMenu, handleCloseCheckModal, scale }) {
    handleCloseMenu();

    const [updateScale, setUpdateScale] = useState(scale);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleScaleChange = ({ target: { value } }) => {
        // Ensure the input is a positive integer
        if (/^\d+$/.test(value) || value === '') {
            setUpdateScale(value);
        }
    };

    const handleSubmit = () => {
        console.log('submit');
        handleClose();
        handleCloseCheckModal();
    }

    return (
        <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
            <Stack>
                <Typography>
                    <h2>Check your final Scale</h2>
                </Typography>
                <Box style={{padding: '10px 0 0 0'}}>
                    <TextField
                        required
                        label="Scale"
                        type="number"
                        value={updateScale}
                        onChange={handleScaleChange}
                    />
                </Box>
                <Box>
                    <Button onClick={handleOpen}>Confirm</Button>

                    <Button onClick={handleCloseCheckModal}>Cancel</Button>
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    container={document.getElementById('root')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Card sx={{ 
                        width: 500, 
                        p: 2, 
                        m: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}>
                        <Typography>
                            <h5>Are you sure you have manufactured {updateScale} tubes/kits in stock?</h5>
                        </Typography>
                        <Button onClick={handleSubmit}>YES!</Button>
                        <Button onClick={handleClose}>NO</Button>
                    </Card>
                </Modal>
            </Stack>
        </Card>
    );
}

ScaleCheckBox.propTypes = {
  handleCloseMenu: PropTypes.func.isRequired,
  handleCloseCheckModal: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
};