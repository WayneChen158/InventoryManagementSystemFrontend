import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { TableRow, TableCell, Button, Modal, Box } from '@mui/material';

import Label from '../../../components/label';

export default function RecipeTableRow ({ row, onAddSubComponent }) {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const openAddModal = () => setIsAddModalOpen(true);
//   const closeAddModal = () => setIsAddModalOpen(false);

  return (
    <>
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
                        onClick={() => onAddSubComponent(row.id, row.itemName, row.vol)}
                    >
                        Add
                    </Button>
                )}

            </TableCell>
        </TableRow>

        {/* <Modal
            open={isAddModalOpen}
            onClose={closeAddModal}
            container={document.getElementById('root')}
        >
        <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '60%', height: '100%'}}>
          <AddComponentForm 
            componentId={row.id}
            componentName={row.itemName}
            requiredScale={scale}
            closeAddModal = {closeAddModal}
          />
        </Box>
      </Modal> */}

    </>
  );
};

RecipeTableRow.propTypes = {
    row: PropTypes.any.isRequired,
    onAddSubComponent: PropTypes.func.isRequired
  };
