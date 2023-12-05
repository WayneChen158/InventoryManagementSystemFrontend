import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Card, Grid, Stack, Button, TextField, FormControl, Select, InputLabel, MenuItem } from '@mui/material';

export default function MarkRequestReceivedForm({
    targetRequestId,
    itemDescription,
    itemCatalog,
    orderedAmount,
}) {
    // 1: fully received, 2: partially received
    const [receivingCondition, setReceivingCondition] = useState(1);

    const [receivedAmount, setReceivedAmount] = useState(0);

    const handelReceivingConditionChange = (event) => {
        setReceivingCondition(event.target.value);
    };

    const handleReceivedAmountChange = (event) => {
        setReceivedAmount(event.target.value);
    };

    return (
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Stack>
                        <Box>
                            <h2>Mark a Request as Received</h2>
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Item name'
                                type='text'
                                value={itemDescription}
                                InputProps={{ readOnly: true }}
                                multiline
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Catlog number'
                                type='text'
                                value={itemCatalog}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <TextField 
                                label='Ordered amount'
                                type='number'
                                value={orderedAmount}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Box style={{padding: '10px 0 0 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id='request-category-select'>
                                    Receiving Condition
                                </InputLabel>
                                <Select
                                    value={receivingCondition}
                                    label='Condition'
                                    onChange={handelReceivingConditionChange}
                                >
                                    <MenuItem value={1}>Fully received</MenuItem>
                                    <MenuItem value={2}>Partially received</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {receivingCondition === 1 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label='Received amount'
                                    type='number'
                                    value={orderedAmount}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>
                        )}

                        {receivingCondition === 2 && (
                            <Box style={{padding: '10px 0 0 0'}}>
                                <TextField 
                                    label='Received amount'
                                    type='number'
                                    value={receivedAmount}
                                    onChange={handleReceivedAmountChange}
                                />
                            </Box>
                        )}
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

MarkRequestReceivedForm.propTypes = {
    targetRequestId: PropTypes.number.isRequired,
    itemDescription: PropTypes.string,
    itemCatalog: PropTypes.string,
    orderedAmount: PropTypes.number,
}