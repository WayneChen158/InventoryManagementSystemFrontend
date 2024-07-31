import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import { Box, Table, Popover, Collapse, TableRow,
  MenuItem, TableCell, TableBody, Typography, IconButton } from '@mui/material';

import { getProductRecordsInStockURL  } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';

import StockTableHead from './stock-table-head';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  id: PropTypes.any,
  catalog: PropTypes.any,
  name: PropTypes.any,
  amountInStock: PropTypes.any,
  unit: PropTypes.any,
  selected: PropTypes.any,
};

export default function ProductTableRow({
  selected,
  id,
  catalog,
  name,
  amountInStock,
  unit,
}) {
  const [productrecordList, setProductrecordList] = useState([]);
  const productrecordInStockURL = useRef(getProductRecordsInStockURL());

  const [open, setOpen] = useState(null);

  const [expand, setExpand] = useState(false);

  const handleExpend = async () => {
    if (!expand) {
      try {
        const response = await fetch(`${productrecordInStockURL.current}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProductrecordList(data);
        } else {
          console.error('Failed to fetch product records');
        }
      } catch (error) {
        console.error('Error fetching product records:', error);
      }
    }
    setExpand(!expand);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleExpend}
          >
            {expand ? <Iconify icon="solar:alt-arrow-down-bold" /> : <Iconify icon="solar:alt-arrow-right-bold" />}
          </IconButton>
        </TableCell>

        <TableCell align="center">
              {catalog}
        </TableCell>

        <TableCell align="center" component="th" scope="row" padding="none">
            <Typography variant="subtitle2" wrap = "true" width='1/4'>
              {name}
            </Typography>
        </TableCell>

        <TableCell align="center">{amountInStock} {unit}</TableCell>


        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Product Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <StockTableHead
                  order={null}
                  orderBy={null}
                  onRequestSort={null}
                  headLabel={[
                    { id: 'productRecordId', label: 'ID' },
                    { id: 'productName', label: 'Product Name' },
                    { id: 'lotNumber', label: 'lot#' },
                    { id: 'amountInStock', label: 'Amount' },
                  ]}
                />
                <TableBody>
                  {productrecordList.map((row) => (
                    <TableRow key={row.productRecordId}>
                      <TableCell />
                      <TableCell align="center">{row.productRecordId}</TableCell>
                      <TableCell align="center">{row.productName}</TableCell>
                      <TableCell align="center">{row.lotNumber}</TableCell>
                      <TableCell align="center">{row.amountInStock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          edit
        </MenuItem>

      </Popover>
    </>
  );
}