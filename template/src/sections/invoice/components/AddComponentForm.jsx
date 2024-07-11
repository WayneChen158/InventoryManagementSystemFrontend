import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import { Box, Modal, Paper, 
    Table, Button, TableRow, TextField, TableHead, TableCell, 
    TableBody, Typography, TableContainer } from '@mui/material';

import { getComponentManufactureURL, postComponentManufactureURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import RecipeTableRow from './RecipeTableRow';

export default function AddComponentForm ({ 
    componentId,
    componentName,
    requiredScale,
    isOpen,
    onClose,
    onAddSubComponent,
    onSubmit,
    submittedComponents,
    handleRefreshData
}) {

  const [scale, setScale] = useState(requiredScale);

  const [allPass, setAllPass] = useState(false);

  const [itemLst, setItemLst] = useState([]);

  const ComponentManufactureURL = useRef(getComponentManufactureURL());

  const submitComponentManufactureURL = useRef(postComponentManufactureURL());

  useEffect(() => {
        fetch(`${ComponentManufactureURL.current}/${componentId}?scale=${scale}`, {
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
        const anyItemNotInStock = itemLst.some((item) => !item.hasEnoughInStock && !submittedComponents.has(item.id));
        const allPassCondition = !(anyItemNotInStock || itemLst.length === 0 || scale <= 0);
    
        setAllPass(allPassCondition);

    }, [itemLst, scale, submittedComponents]);

  const handleScaleChange = (event) => {
        setScale(event.target.value);
      };

  const handleSubmit = () => {
        if(componentId !== 0) {
            fetch(`${submitComponentManufactureURL.current}/${componentId}?scale=${scale}`, {
                method: 'POST',
            }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
        console.log("submit test")
        onSubmit(componentId);
        onClose();
        setTimeout(() => {
            handleRefreshData();
          }, config.timeout);
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
                label="Scale (tests)"
                type="number"
                value={scale}
                onChange={handleScaleChange}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!allPass}>
                Add This Manufacture Task
            </Button>


            <Paper sx={{ width: '100%', overflow: 'auto' }}>
                <TableContainer sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell align="center">vol/(tests for i-component) Per Rxn</TableCell>
                                <TableCell align="center">Required Amount</TableCell>
                                <TableCell align="center">Amount In Stock</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {itemLst.map((row, index) => (
                                <RecipeTableRow 
                                    key = {`${row.id}_${row.type}_${index}`}
                                    row = {row}
                                    onAddSubComponent={onAddSubComponent}
                                    isSubmitted={submittedComponents.has(row.id)}
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
    onSubmit: PropTypes.func.isRequired,
    submittedComponents: PropTypes.any,
    handleRefreshData: PropTypes.func,
  };