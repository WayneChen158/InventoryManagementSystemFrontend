import React from 'react';
import PropTypes from 'prop-types';

import { TableRow, TableCell, Button, Modal, Box } from '@mui/material';

export default function ProductRecipeTableRow ({ row, onAddSubComponent, scale }) {

  const handleClick = () => {
    if (row.type === 'component') {
        onAddSubComponent(row.componentId, row.componentName, scale);
    } else {
        console.log("Raw material request sent");
    }
  }

  return (
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
                >
                    Add
                </Button>
            )}
        </TableCell>
    </TableRow>
  );
};

ProductRecipeTableRow.propTypes = {
    row: PropTypes.any.isRequired,
    onAddSubComponent: PropTypes.func.isRequired,
    scale: PropTypes.any.isRequired,
  };
 