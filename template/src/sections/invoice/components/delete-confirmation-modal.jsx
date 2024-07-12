import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Box, Typography, Button, Card, IconButton
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ConfirmationModal({ open, handleClose, handleConfirm, title, description }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <Card sx={{ width: '30%', padding: 3, position: 'relative' }}>
          <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ position: 'absolute', top: 0, right: 0 }}
              sx={{ padding: 2 }}
          >
              <Iconify icon="material-symbols:close" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
            {title}
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginBottom: 2 }}>
            {description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ marginRight: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleConfirm}>Confirm</Button>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
