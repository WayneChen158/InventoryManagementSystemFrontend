import * as React from 'react';
import { useState } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Card, Box, Button, TextField, Select, MenuItem, InputLabel, Stack, Grid } from '@mui/material';

export default function NewTaskForm() {
  const [type, setType] = useState('component');
  const [component, setComponent] = useState('');
  const [product, setProduct] = useState('');
  const [scale, setScale] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleComponentChange = (event) => {
    setComponent(event.target.value);
  };

  const handleProductChange = (event) => {
    setProduct(event.target.value);
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
    console.log('Component:', component);
    console.log('Product:', product);
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
                    <Select value={product} onChange={handleProductChange}>
                        <MenuItem value="product1">Product 1</MenuItem>
                        <MenuItem value="product2">Product 2</MenuItem>
                        {/* Add more product options here */}
                    </Select>
                    </FormControl>
                    <FormControl style={{padding: '10px 0 0 0'}}>
                    <InputLabel>Choose Component</InputLabel>
                    <Select value={component} onChange={handleComponentChange}>
                        <MenuItem value="component1">Component 1</MenuItem>
                        <MenuItem value="component2">Component 2</MenuItem>
                        {/* Add more component options here */}
                    </Select>
                    </FormControl>
                    </>
                )}

                {type === 'product' && (
                    <FormControl>
                        <InputLabel>Choose Product</InputLabel>
                        <Select value={product} onChange={handleProductChange}>
                        <MenuItem value="product1">Product 1</MenuItem>
                        <MenuItem value="product2">Product 2</MenuItem>
                        {/* Add more product options here */}
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
