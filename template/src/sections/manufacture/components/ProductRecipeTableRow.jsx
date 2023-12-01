import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Modal, Button, TableRow, TableCell } from '@mui/material';

import NewRequestForm from 'src/sections/request/components/NewRequestForm';

export default function ProductRecipeTableRow ({ row, onAddSubComponent, scale, isSubmitted }) {

    const [openRequestRawMaterialModal, setOpenRequestRawMaterialModal] = useState(false);
  
    const handleOpenRequestRawMaterialModal = () => {
        setOpenRequestRawMaterialModal(true);
    }

    const handleCloseRequestRawMaterialModal = () => {
        setOpenRequestRawMaterialModal(false);
    }
    
    const handleClick = () => {
    if (row.type === 'component') {
        onAddSubComponent(row.componentId, row.componentName, scale);
    } else {
        console.log("Raw material request sent");
        handleOpenRequestRawMaterialModal();
    }
  }

  return (
    <>
    <TableRow>
        <TableCell>{row.componentName}</TableCell>
        <TableCell>{row.lotNumber || 'N/A'}</TableCell>
        <TableCell>{row.manufactureDate ? new Date(row.manufactureDate).toLocaleDateString() : 'N/A'}</TableCell>
        <TableCell>{row.amountInStock}</TableCell>
        <TableCell>
            {/* Conditional rendering of button */}
            {(row.amountInStock < scale || row.amountInStock === 0) && (
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleClick}
                    disabled={isSubmitted}
                >
                    Add
                </Button>
            )}
        </TableCell>
    </TableRow>
    <Modal
        open={openRequestRawMaterialModal}
        onClose={handleCloseRequestRawMaterialModal}
        container={document.getElementById('root')}
    >
        <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
            <NewRequestForm 
                handleCloseModal={handleCloseRequestRawMaterialModal}
                inventoryItems={[]}
            />
        </Box>
    </Modal>
    </>
  );
};

ProductRecipeTableRow.propTypes = {
    row: PropTypes.any.isRequired,
    onAddSubComponent: PropTypes.func.isRequired,
    scale: PropTypes.any.isRequired,
    isSubmitted: PropTypes.any,
  };
 