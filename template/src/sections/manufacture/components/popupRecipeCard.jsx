import * as React from 'react';
import PropTypes from 'prop-types';

import { Box, Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function ExportDefaultToolbar({ data }) {
  const rows = data;

  const columns = [
    { field: 'itemName', headerName: 'Item Name', width: 300 },
    { field: 'amountPerRxn', headerName: 'Amount Per Reaction', width: 150 },
    { 
      field: 'totalVol', 
      headerName: 'Total Volume', 
      width: 150,
      valueFormatter: (params) => params.value != null ? Number(params.value).toFixed(2) : ''
    },
  ];

  return (
    <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
      <Box>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.recordDetailId} slots={{ toolbar: GridToolbar }} />
      </Box>
    </Card>
  );
}

ExportDefaultToolbar.propTypes = {
  data: PropTypes.array.isRequired,
};