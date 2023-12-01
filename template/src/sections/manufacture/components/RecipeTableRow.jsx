import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';

import { Box, Modal, Button, TableRow, TableCell } from '@mui/material';

import { getRawMaterialsURL } from 'src/utils/url-provider';

import NewRequestForm from 'src/sections/request/components/NewRequestForm';

import Label from '../../../components/label';

export default function RecipeTableRow ({ row, isSubmitted, onAddSubComponent }) {

    const rawMaterialsURL = useRef(getRawMaterialsURL());

    const [inventoryData, setInventoryData] = useState([]);
    
    const [openRequestRawMaterialModal, setOpenRequestRawMaterialModal] = useState(false);
    
    const [candidateRawMaterial, setCandidateRawMaterial] = useState({});
  
    const handleOpenRequestRawMaterialModal = () => {
        setOpenRequestRawMaterialModal(true);
    }

    const handleCloseRequestRawMaterialModal = () => {
        setOpenRequestRawMaterialModal(false);
    }
  
    const handleClick = () => {
        if (row.type === 'component') {
            onAddSubComponent(row.id, row.itemName, row.vol);
        } else {
            console.log("Raw material request sent");
            console.log(row);
            const candidateItem = inventoryData.find(item => item.materialId === row.id);
            console.log(candidateItem);
            setCandidateRawMaterial(candidateItem);
            handleOpenRequestRawMaterialModal();
        }
    }

    useEffect(() => {
        fetch(rawMaterialsURL.current)
        .then(res => res.json())
        .then(data => {
          console.log("Raw Material Fetch Invoked!")
          console.log(data)
          setInventoryData(data)
        })
      }, []);

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
                candidateItemDescription={candidateRawMaterial.description}
                candidateItemCatalog={candidateRawMaterial.catalogNumber}
                candidateItemAmount={row.vol}
            />
        </Box>
    </Modal>
    </>
  );
};

RecipeTableRow.propTypes = {
    row: PropTypes.any.isRequired,
    isSubmitted: PropTypes.any,
    onAddSubComponent: PropTypes.func.isRequired
  };
