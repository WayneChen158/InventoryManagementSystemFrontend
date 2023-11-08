import * as React from 'react';
import { useState, useEffect } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Card, Box, Button, TextField, Select, MenuItem, InputLabel, Stack, Grid } from '@mui/material';

import { config } from '../../../config';

export default function NewTaskForm() {
  const [type, setType] = useState('component');
  const [componentId, setComponentId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [scale, setScale] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const [productLst, setProductLst] = useState([]);
  const [componentLst, setComponentLst] = useState([]);

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
  }
}, [productId]);

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
    console.log(isChecking);
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
    <Grid item xs={6}>
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
                
                <Button variant="contained" onClick={handleSubmit} style={{margin: '0 0 0 0'}}>
                    Submit
                </Button>
            </Box>
        </Stack>
    </Card>
    </Grid>
    {isChecking && (
      <Grid item xs>
        <Card>
          <h2>Coming soon</h2>
        </Card>
      </Grid>
    )}
    </Grid>
  );
}
