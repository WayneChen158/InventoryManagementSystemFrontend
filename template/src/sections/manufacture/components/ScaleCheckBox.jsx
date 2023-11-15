import { useState } from 'react';
import PropTypes from 'prop-types';

import {  Box, Card, Stack,  Modal, Button, TextField, Typography } from '@mui/material';

import { config } from '../../../config';

export default function ScaleCheckBox({ handleCloseCheckModal, scale, manufactureRecordId }) {

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
        fetch(`http://${config.server_host}:${config.server_port}/api/components/manufacture/${manufactureRecordId}?updateScale=${updateScale}`, {
            method: 'PUT',
        }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        }).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        });
        handleClose();
        handleCloseCheckModal();
    }

    return (
        <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
            <Stack>
            <Typography component="h2" sx={{ fontWeight: 'bold',fontSize: '25px' , padding: '10px 0 20px 0',}}>
                Check your final Scale
            </Typography>
                <Box style={{padding: '10px 0 20px 0'}}>
                    <TextField
                        required
                        label="Scale (tubes/kits)"
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
                        <Typography component='h5'>
                            Are you sure you have manufactured {updateScale} tubes/kits in stock?
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
  handleCloseCheckModal: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  manufactureRecordId: PropTypes.number.isRequired,
};