import { useState } from 'react';
import PropTypes from 'prop-types';

import {  Box, Card, Stack,  Modal, Button, TextField, Typography } from '@mui/material';

import { config } from '../../../config';

export default function ScaleCheckBox({ handleCloseCheckModal, name, scale, unit, lotNumber, manufactureRecordId, handleOperation }) {
    const initialScale = unit === 'tube(s)' ? scale / 100 : scale;
    const [updateScale, setUpdateScale] = useState(initialScale);

    const [updateLotNumber, setUpdateLotNumber] = useState(lotNumber);

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

    const handleLotNumberChange = ({ target: { value } }) => {
        // Ensure the input is a positive integer
        setUpdateLotNumber(value);
    };

    const handleSubmit = () => {
        fetch(`http://${config.server_host}:${config.server_port}/api/manufacture/${manufactureRecordId}?updateScale=${updateScale}&updateLotNumber=${updateLotNumber}`, {
            method: 'PUT',
        }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        }).catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
        handleClose();
        handleCloseCheckModal();
        setTimeout(() => {
            handleOperation();
          }, config.timeout);
    }

    return (
        <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
            <Stack>
            <Typography component="h2" sx={{ fontWeight: 'bold',fontSize: '25px' , padding: '10px 0 10px 0',}}>
                Check {name} final Scale
            </Typography>
                <Box style={{padding: '10px 0 20px 0'}}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle1">Manufacture Scale: </Typography>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: 'larger' }}> {scale} </Typography>
                        <Typography variant="subtitle1">
                            {unit === 'kit(s)' ? 'kit(s)' : 'tests'}
                        </Typography>
                    </Stack>
                </Box>
                <Box style={{padding: '10px 0 20px 0'}}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle1">Production Yield: </Typography>
                        <TextField
                            required
                            label="Scale"
                            type="number"
                            value={updateScale}
                            onChange={handleScaleChange}
                        />
                        <Typography variant="subtitle1">{unit}</Typography>
                    </Stack>
                </Box>
                <Box style={{padding: '10px 0 5px 0'}}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle1">Lot Number: </Typography>
                        <TextField
                            required
                            label="Lot Number"
                            type="text"
                            value={updateLotNumber}
                            onChange={handleLotNumberChange}
                        />
                    </Stack>
                </Box>
                <Box>
                    <Button 
                        variant="contained" 
                        onClick={handleOpen}
                        style={{ margin: '10px 20px 0 0' }}
                    >
                        Confirm
                    </Button>

                    <Button 
                        variant="contained" 
                        onClick={handleCloseCheckModal}
                        style={{ margin: '10px 20px 0 10px' }}
                    >
                        Cancel
                    </Button>
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
                        <Box>
                            <Typography component='h5' variant='h6' gutterBottom>
                                Confirm Manufacturing Details
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                                Name: {name}
                            </Typography>
                            <Typography variant='body2' gutterBottom>
                                Quantity: {updateScale} {unit} in stock?
                            </Typography>
                            <Typography variant='body2'>
                                Lot Number: {lotNumber}
                            </Typography>
                        </Box>
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
  name: PropTypes.any,
  scale: PropTypes.number.isRequired,
  unit: PropTypes.any,
  lotNumber: PropTypes.any,
  manufactureRecordId: PropTypes.number.isRequired,
  handleOperation: PropTypes.any,
};