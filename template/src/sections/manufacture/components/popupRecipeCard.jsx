import * as React from 'react';
import PropTypes from 'prop-types';

import { Box, Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function ExportDefaultToolbar({ data }) {
  const rows = data;

  const columns = [
    { field: 'itemName', headerName: 'Item Name', width: 300 },
    { field: 'amountPerRxn', headerName: 'amountPerRxn', width: 150 },
    { field: 'totalVol', headerName: 'totalVol', width: 150 },
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