import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box, Card, Grid, Stack, Paper, Table, Select,
    Button, TableRow, MenuItem, TextField, TableHead, 
    TableCell, TableBody, InputLabel, TableContainer } from '@mui/material';

import { config } from '../../../config';
import RecipeTableRow from './RecipeTableRow';
import AddComponentForm from './AddComponentForm';
import ProductRecipeTableRow from './ProductRecipeTableRow';

export default function NewTaskForm({ handleCloseModal, handleRefreshData }) {
  const [type, setType] = useState('component');
  const [componentId, setComponentId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [scale, setScale] = useState(0);

  const [isChecking, setIsChecking] = useState(false);
  const [allPass, setAllPass] = useState(false);

  const [productLst, setProductLst] = useState([]);
  const [componentLst, setComponentLst] = useState([]);
  const [itemLst, setItemLst] = useState([]);

  const [componentsStack, setComponentsStack] = useState([]);
  const [submittedComponents, setSubmittedComponents] = useState(new Set());

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/api/products`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        setProductLst(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  useEffect(() => {
    if (productId === 0) {
      fetch(`http://${config.server_host}:${config.server_port}/api/components`, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((resdata) => {
            setComponentLst(resdata);
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/api/products/components/${productId}`, {
        method: 'GET',
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        setComponentLst(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }}, [productId]);

    useEffect(() => {
        if (type === 'component' && componentId !== 0 && isChecking) {
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
            });
        } else if (type === 'product' && productId !== 0 && isChecking) {
            fetch(`http://${config.server_host}:${config.server_port}/api/products/manufacture/${productId}`, {
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
                });
        }}, [type, productId, componentId, isChecking, scale]);

    useEffect(() => {
        let allPassCondition;
    
        if (type === 'component') {
            // For components, check if any item in itemLst has hasEnoughInStock as false
            const anyItemNotInStock = itemLst.some((item) => !item.hasEnoughInStock && !(submittedComponents.has(item.id) && item.type === 'component'));
            allPassCondition = !(anyItemNotInStock || itemLst.length === 0 || scale <= 0);
        } else if (type === 'product') {
            // For products, check if any item in itemLst has amountInStock less than scale
            const anyItemNotSufficient = itemLst.some((item) => item.amountInStock < scale && !submittedComponents.has(item.componentId));
            allPassCondition = !(anyItemNotSufficient || itemLst.length === 0 || scale <= 0);
        }
    
        setAllPass(allPassCondition);
    }, [itemLst, submittedComponents, scale, type]);


    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const handleComponentChange = (event) => {
        setComponentId(event.target.value);
    };

    const handleProductChange = (event) => {
        setProductId(event.target.value);
    };

    const handleScaleChange = ({ target: { value } }) => {
        // Ensure the input is a positive integer
        if (/^\d+$/.test(value) || value === '') {
            setScale(value);
        }
    };

    // Function to handle the 'Add' action from RecipeTableRow
    const handleAddComponentClick = (iComponentId, itemName, requiredScale) => {
        // This will set the component details which will be used to open the AddComponentForm
        setComponentsStack(prevStack => [
            ...prevStack,
            { iComponentId, itemName, requiredScale }
          ]);
    };

    // Function to close the AddComponentForm modal
    const handleCloseAddComponentForm = () => {
        setComponentsStack(prevStack => prevStack.slice(0, prevStack.length - 1));
    };

    const handleComponentSubmit = (iComponentId) => {
        setSubmittedComponents((prevSubmitted) => {
          const newSubmitted = new Set(prevSubmitted);
          newSubmitted.add(iComponentId);
          return newSubmitted;
        });
      };

    const handleCheckInventory = () => {
        setIsChecking(true);
    };

    const handleSubmit = () => {
        if(componentId !== 0) {
            fetch(`http://${config.server_host}:${config.server_port}/api/components/manufacture/${componentId}?scale=${scale}`, {
                method: 'POST',
            }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            });
        } else {
            fetch(`http://${config.server_host}:${config.server_port}/api/products/manufacture/${productId}?scale=${scale}`, {
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
        handleCloseModal();
        setTimeout(() => {
            handleRefreshData();
          }, config.timeout);
    };

    return (
        <Grid container spacing={0.5} justifyContent="center">
        {isChecking && <Grid item xs = {12}>
        <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '18vh' }}>
            <Box style={{padding: '10px 0 0 0'}}>
                <FormControl>
                <FormLabel>Task Type</FormLabel>
                <RadioGroup column = 'true' value={type} onChange={handleTypeChange}>
                    <FormControlLabel value="component" control={<Radio />} label="Component" />
                    <FormControlLabel value="product" control={<Radio />} label="Product" />
                </RadioGroup>
                </FormControl>
            </Box>

            {type === 'component' && (
                <>
                <FormControl style={{padding: '10px 10px 0 0', width: '200px'}}>
                    <InputLabel>Choose Product</InputLabel>
                    <Select value={productId} onChange={handleProductChange}>
                        <MenuItem key = {0} value={0}>None</MenuItem>
                        {productLst.map((product) => (
                            <MenuItem key={product.productId} value={product.productId}>{product.productName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{padding: '10px 10px 0 0', width: '200px'}}>
                    <InputLabel>Choose Component</InputLabel>
                    <Select value={componentId} onChange={handleComponentChange}>
                        <MenuItem key = {0} value={0}>None</MenuItem>
                        {componentLst.map((component) => (
                            <MenuItem key={component.componentId} value={component.componentId}>{component.componentName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </>
            )}

            {type === 'product' && (
                <FormControl style={{padding: '10px 10px 0 0', width: '200px'}}>
                    <InputLabel>Choose Product</InputLabel>
                    <Select value={productId} onChange={handleProductChange}>
                        <MenuItem key = {0} value={0}>None</MenuItem>
                        {productLst.map((product) => (
                            <MenuItem key={product.productId} value={product.productId}>{product.productName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

        <Box style={{padding: '10px 0 0 0', width: '150px'}}>
            <TextField
                label="Scale"
                type="number"
                value={scale}
                onChange={handleScaleChange}
            />
        </Box>

        <Stack style={{padding: '10px 0 0 10px'}}>
            <Button variant="contained" onClick={handleCheckInventory} >
                Check Inventory
            </Button>
            
            <Button 
                variant="contained" 
                onClick={handleSubmit} 
                style={{margin: '10px 0 0 0'}}
                disabled={!allPass}
            >
                Submit
            </Button>
        </Stack>
        </Card>
        </Grid>}
        
        {!isChecking && <Grid item xs={6}>
            <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Stack>
                    <Box>
                        <h2>Create a new manufacture task</h2>
                    </Box>
                    <Box style={{padding: '10px 0 0 0'}}>
                        <FormControl>
                        <FormLabel>Task Type</FormLabel>
                        <RadioGroup row value={type} onChange={handleTypeChange}>
                            <FormControlLabel value="component" control={<Radio />} label="Component" />
                            <FormControlLabel value="product" control={<Radio />} label="Product" />
                        </RadioGroup>
                        </FormControl>
                    </Box>

                    <Stack style={{padding: '10px 0 0 0'}}>
                        {type === 'component' && (
                            <>
                            <FormControl style={{padding: '10px 0 10px 0'}}>
                                <InputLabel>Choose Product</InputLabel>
                                <Select value={productId} onChange={handleProductChange}>
                                    <MenuItem key = {0} value={0}>None</MenuItem>
                                    {productLst.map((product) => (
                                        <MenuItem key={product.productId} value={product.productId}>{product.productName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl style={{padding: '10px 0 0 0'}}>
                                <InputLabel>Choose Component</InputLabel>
                                <Select value={componentId} onChange={handleComponentChange}>
                                    <MenuItem key = {0} value={0}>None</MenuItem>
                                    {componentLst.map((component) => (
                                        <MenuItem key={component.componentId} value={component.componentId}>{component.componentName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            </>
                        )}

                        {type === 'product' && (
                            <FormControl>
                                <InputLabel>Choose Product</InputLabel>
                                <Select value={productId} onChange={handleProductChange}>
                                    <MenuItem key = {0} value={0}>None</MenuItem>
                                    {productLst.map((product) => (
                                        <MenuItem key={product.productId} value={product.productId}>{product.productName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Stack>
                
                    <Box style={{padding: '10px 0 0 0'}}>
                        <TextField
                            label="Scale"
                            type="number"
                            value={scale}
                            onChange={handleScaleChange}
                        />
                    </Box>

                    <Box style={{padding: '10px 0 0 0'}}>
                        <Button variant="contained" onClick={handleCheckInventory} style={{margin: '0 10px 0 0'}}>
                            Check Inventory
                        </Button>
                        
                        <Button variant="contained" onClick={handleSubmit} style={{margin: '0 0 0 0'}} disabled={!allPass}>
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </Card>
        </Grid>}
        {isChecking && (
        <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'auto' }}>
                <TableContainer sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    {type === 'component' && <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{type === 'component' ? 'Item Name' : 'Component Name'}</TableCell>
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
                                isSubmitted={submittedComponents.has(row.id) && row.type === 'component'}
                                onAddSubComponent={handleAddComponentClick}
                            />
                        ))}
                        </TableBody>
                    </Table>}
                    {type === 'product' && <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Component Name</TableCell>
                                <TableCell>Lot Number</TableCell>
                                <TableCell>Manufacture Date</TableCell>
                                <TableCell>Amount In Stock (tubes)</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemLst.map((row) => (
                                <ProductRecipeTableRow 
                                    key={row.componentId}
                                    row={row}
                                    onAddSubComponent={handleAddComponentClick}
                                    scale={scale}
                                    isSubmitted={submittedComponents.has(row.componentId)}
                                />
                            ))}
                        </TableBody>
                </Table>}
                </TableContainer>
            </Paper>
        </Grid>
        )}
        {componentsStack.map((component, index) => (
        <AddComponentForm
            key={`${component.componentId}_${index}`}
            componentId={component.iComponentId}
            componentName={component.itemName}
            requiredScale={component.requiredScale}
            isOpen={index === componentsStack.length - 1} // Only the last modal in the stack is open
            onClose={handleCloseAddComponentForm}
            onAddSubComponent={handleAddComponentClick}
            onSubmit={handleComponentSubmit}
            submittedComponents = {submittedComponents}
            handleRefreshData={handleRefreshData}
        />
        ))}
        </Grid>
    );
}

NewTaskForm.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    handleRefreshData: PropTypes.func,
  };