import * as React from 'react';
import { useState, useEffect } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Card, Box, Button, TextField, Select,
    MenuItem, InputLabel, Stack, Grid, TableHead, 
    TableRow, TableCell, TableBody, Table, Paper, TableContainer } from '@mui/material';

import { config } from '../../../config';
import Label from '../../../components/label';

export default function NewTaskForm() {
  const [type, setType] = useState('component');
  const [componentId, setComponentId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [scale, setScale] = useState(0);

  const [isChecking, setIsChecking] = useState(false);
  const [allPass, setAllPass] = useState(false);

  const [productLst, setProductLst] = useState([]);
  const [componentLst, setComponentLst] = useState([]);
  const [itemLst, setItemLst] = useState([]);

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
        if (componentId !== 0 && isChecking) {
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
        }}, [componentId, isChecking, scale]);

    useEffect(() => {
        // Check if any item in itemLst has hasEnoughInStock as false
        const anyItemNotInStock = itemLst.some((item) => !item.hasEnoughInStock);
        
        // Set allPass to the negation of anyItemNotInStock
        setAllPass(!(anyItemNotInStock || itemLst.length === 0));
        }, [itemLst]);


  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleComponentChange = (event) => {
    setComponentId(event.target.value);
  };

  const handleProductChange = (event) => {
    setProductId(event.target.value);
  };

  const handleScaleChange = (event) => {
    // Ensure the input is a positive integer
    const value = event.target.value;
    if (/^\d+$/.test(value) || value === '') {
      setScale(value);
    }
  };

  const handleCheckInventory = () => {
    setIsChecking(true);
  };

  const handleSubmit = () => {
    // Replace with your form submission logic
    console.log('Form submitted');
    console.log('Type:', type);
    console.log('Component:', componentId);
    console.log('Product:', productId);
  };

  return (
    <Grid container spacing={0.5} justifyContent="center">
    {isChecking && <Grid item xs = {12}>
    <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '120px' }}>
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
                        <FormControl style={{padding: '10px 0 0 0'}}>
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 800 }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>{type === 'component' ? 'Item Name' : 'Component Name'}</TableCell>
                        <TableCell>Vol Per Rxn</TableCell>
                        <TableCell>Required Amount</TableCell>
                        <TableCell>Amount In Stock</TableCell>
                        <TableCell>test</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {itemLst.map((row) => (
                    <TableRow key = {row.id}>
                        <TableCell>{row.itemName}</TableCell>
                        <TableCell>{row.volPerRxn}</TableCell>
                        <TableCell>{row.vol}</TableCell>
                        <TableCell>
                            <Label color={row.hasEnoughInStock ? 'success' : 'error'}>{row.hasEnoughInStock ? 'YES' : 'NO'}</Label>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Paper>
      </Grid>
    )}
    </Grid>
  );
}
