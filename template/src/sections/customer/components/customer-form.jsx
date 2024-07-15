import * as React from 'react';
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import { Box, Card, Grid, Stack, Button, TextField, IconButton } from '@mui/material';

import { addCustomerURL, updateCustomerURL } from 'src/utils/url-provider';

import { config } from 'src/config';

import Iconify from 'src/components/iconify';

CustomerForm.propTypes = {
    currentInfo: PropTypes.any,
    handleCloseModal: PropTypes.func.isRequired,
    triggerRefresh: PropTypes.func,
};

export default function CustomerForm({
    currentInfo,
    handleCloseModal,
    triggerRefresh,
}) {
    const [customerId, setCustomerId] = useState();
    const [customerName, setCustomerName] = useState('');
    const [company, setCompany] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');

    const addNewCustomerURL = useRef(addCustomerURL());
    const updateCustomerInfo = useRef(updateCustomerURL());

    useEffect(() => {
        if (currentInfo !== null) {
            setCustomerId(currentInfo.customerId);
            setCustomerName(currentInfo.customerName);
            setCompany(currentInfo.company);
            setPhoneNumber(currentInfo.phoneNumber);
            setEmailAddress(currentInfo.emailAddress);
            setShippingAddress(currentInfo.shipAddress);
        }
    }, [currentInfo]);

    const handleCustomerNameChange = (e) => {
        setCustomerName(e.target.value);
    };

    const handleCompanyChange = (e) => {
        setCompany(e.target.value);  
    };

    const handlePhoneChange = (e) => {
        setPhoneNumber(e.target.value);  
    };

    const handleEmailChange = (e) => {
        setEmailAddress(e.target.value); 
    };

    const handleShippingAddressChange = (e) => {
        setShippingAddress(e.target.value);  
    };

    const isFormValid = () => (
        customerName !== "" &&
        shippingAddress !== ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerData = {
            customerName,
            company,
            phoneNumber,
            emailAddress,
            shippingAddress,
        };

        if (currentInfo == null) {
            fetch(addNewCustomerURL.current, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            })
            .then((response) => {
                if (response.ok) {
                    console.log(`New Customer ${customerName} was successfully created`);
                } else {
                    console.log(`Failed to create new customer ${customerName}`);
                }
            });
        } else {
            fetch(`${updateCustomerInfo.current}/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            })
            .then((response) => {
                if (response.ok) {
                    console.log(`Customer ${customerName} info was successfully updated`);
                } else {
                    console.log(`Failed to update ${customerName} info`);
                }
            });
        }

        handleCloseModal();

        if (triggerRefresh) {
            setTimeout(() => {
                triggerRefresh();
            }, config.timeout);
        }
    };

    return (
        <Grid container spacing={0.5} justifyContent="center">
            <Grid item xs={6}>
                <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Stack>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                            <Iconify icon="material-symbols:close" />
                        </IconButton>
                        <Box>
                            <h2>{currentInfo ? "Update Customer Info" : "Add a New Customer"}</h2>
                        </Box>
                        <Box style={{ padding: '10px 0 0 0' }}>
                            <TextField
                                required
                                multiline
                                label="Customer Name"
                                type="text"
                                value={customerName}
                                onChange={handleCustomerNameChange}
                            />
                        </Box>
                        <Box style={{ padding: '10px 0 0 0' }}>
                            <TextField
                                required
                                label="Company"
                                type="text"
                                value={company}
                                onChange={handleCompanyChange}
                            />
                        </Box>
                        <Box style={{ padding: '10px 0 0 0' }}>
                            <TextField
                                label="Phone Number"
                                type="text"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                            />
                        </Box>
                        <Box style={{ padding: '10px 0 0 0' }}>
                            <TextField
                                required
                                label="Email"
                                type="text"
                                value={emailAddress}
                                onChange={handleEmailChange}
                            />
                        </Box>
                        <Box style={{ padding: '10px 0 0 0' }}>
                            <TextField
                                label="Shipping Address"
                                type="text"
                                value={shippingAddress}
                                onChange={handleShippingAddressChange}
                            />
                        </Box>
                        <Box style={{ padding: '10px 0 0 0' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                style={{ margin: '0 0 0 0' }}
                                disabled={!isFormValid()}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}

