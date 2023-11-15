import React from 'react';
import PropTypes from 'prop-types';

import { TableRow, TableCell, Button } from '@mui/material';

import Label from '../../../components/label';

export default function RecipeTableRow ({ row, isSubmitted, onAddSubComponent }) {

  const handleClick = () => {
    if (row.type === 'component') {
        onAddSubComponent(row.id, row.itemName, row.vol);
    } else {
        console.log("Raw material request sent");
    }
  }

  return (
    <TableRow>
        <TableCell>{row.itemName}</TableCell>
        <TableCell>{row.volPerRxn}</TableCell>
        <TableCell>{row.vol}</TableCell>
        <TableCell>
            <Label color={row.hasEnoughInStock ? 'success' : 'error'}>{row.hasEnoughInStock ? 'YES' : 'NO'}</Label>
        </TableCell>
        <TableCell>
            {/* Conditional rendering of button */}
            {(!row.hasEnoughInStock) && (
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
  );
};

RecipeTableRow.propTypes = {
    row: PropTypes.any.isRequired,
    isSubmitted: PropTypes.any,
    onAddSubComponent: PropTypes.func.isRequired
  };
