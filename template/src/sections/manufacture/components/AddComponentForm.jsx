import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Paper, Typography, TextField, 
    Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Box, Modal } from '@mui/material';

import { config } from '../../../config';
import RecipeTableRow from './RecipeTableRow';

export default function AddComponentForm ({ 
    componentId,
    componentName,
    requiredScale,
    isOpen,
    onClose,
    onAddSubComponent,
}) {

  const [scale, setScale] = useState(requiredScale);

  const [allPass, setAllPass] = useState(false);

  const [itemLst, setItemLst] = useState([]);

  useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/api/components/manufacture/${componentId}?scale=${scale}`, {
            method: 'GET',
        })
        .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then((resdata) => {
            setItemLst(resdata);
        })
        .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        })
    }, [componentId, scale]);

  useEffect(() => {
        // For components, check if any item in itemLst has hasEnoughInStock as false
        const anyItemNotInStock = itemLst.some((item) => !item.hasEnoughInStock);
        const allPassCondition = !(anyItemNotInStock || itemLst.length === 0 || scale <= 0);
    
        setAllPass(allPassCondition);

    }, [itemLst, scale]);

  const handleScaleChange = (event) => {
        setScale(event.target.value);
      };

  const handleSubmit = () => {
        // if(componentId !== 0) {
        //     fetch(`http://${config.server_host}:${config.server_port}/api/components/manufacture/${componentId}?scale=${scale}`, {
        //         method: 'POST',
        //     }).then((response) => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }
        //     return response.json();
        //     }).catch((error) => {
        //     console.error('There was a problem with the fetch operation:', error);
        //     });
        // }
        console.log("submit test")
        onClose();
    };
    
  return (
    <Modal
            open={isOpen}
            onClose={onClose}
            container={document.getElementById('root')}
            sx={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '60%'}}
        >
        <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '100%', height: '100%'}}>
            <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Add Component
            </Typography>
            <Typography variant="subtitle1">
                Component Name: {componentName}
            </Typography>
            <Typography variant="subtitle1">
                Component ID: {componentId}
            </Typography>
            <TextField
                fullWidth
                label="Scale"
                type="number"
                value={scale}
                onChange={handleScaleChange}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allPass}>
                Add to Inventory
            </Button>


                <Paper sx={{ width: '100%', overflow: 'auto' }}>
                    <TableContainer sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Vol Per Rxn</TableCell>
                                    <TableCell>Required Amount</TableCell>
                                    <TableCell>Amount In Stock</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {itemLst.map((row, index) => (
                                    <RecipeTableRow 
                                        key = {`${row.id}_${row.type}_${index}`}
                                        row = {row}
                                        onAddSubComponent={onAddSubComponent}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Paper>
        </Box>
    </Modal> 
  );
};

AddComponentForm.propTypes = {
    componentId: PropTypes.number.isRequired,
    componentName: PropTypes.string.isRequired,
    requiredScale: PropTypes.any.isRequired,
    isOpen: PropTypes.any.isRequired,
    onClose: PropTypes.any.isRequired,
    onAddSubComponent: PropTypes.func.isRequired,
  };