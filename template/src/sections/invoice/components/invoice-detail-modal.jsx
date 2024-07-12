import PropTypes from 'prop-types';
import {
  Box, Modal, Card, Typography, IconButton, Table, TableHead,
  TableRow, TableCell, TableBody, TableContainer
} from '@mui/material';

import Iconify from 'src/components/iconify';

InvoiceDetailsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    invoiceNumber: PropTypes.string.isRequired,
    invoiceContents: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string.isRequired,
        uniqueId: PropTypes.string.isRequired,
        sku: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ).isRequired,
    page: PropTypes.string
  };

export default function InvoiceDetailsModal({ open, handleClose, invoiceNumber, invoiceContents, page }) {
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
            <Card sx={{ width: '70%', padding: '20px', position: 'relative' }}>
              <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  sx={{ padding: 2 }}
              >
                  <Iconify icon="material-symbols:close" />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ marginTop: 4, marginBottom: 4 }}>
                Invoice Details: {invoiceNumber}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Description (Lot Number)</TableCell>
                      <TableCell>Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceContents.map((content) => (
                      <TableRow key={`${content.invoiceContentID}`}>
                        <TableCell>{content.sku}</TableCell>
                        <TableCell>{content.description}</TableCell>
                        <TableCell>{content.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Modal>
    );
  }
