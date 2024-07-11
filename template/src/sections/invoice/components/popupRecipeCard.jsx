import axios from 'axios';
import * as React from 'react';
import PropTypes from 'prop-types';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Card, Alert, Snackbar } from '@mui/material';

import { updateRecipeRowURL } from 'src/utils/url-provider';

export default function ExportDefaultToolbar({ data }) {
  const rows = data;

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const updateRecipeRow = React.useRef(updateRecipeRowURL());

  const columns = [
    { field: 'itemName', headerName: 'Item Name', width: 300, editable: true, },
    { field: 'amountPerRxn', headerName: 'Amount Per Reaction', width: 150 },
    { 
      field: 'totalVol', 
      headerName: 'Total Volume',
      editable: true,
      width: 150,
      valueFormatter: (params) => params.value != null ? Number(params.value).toFixed(2) : ''
    },
  ];

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      try {
        // Here you make the PUT request to your backend
        // Construct the URL with the row ID
        const url = `${updateRecipeRow.current}/${newRow.recordDetailId}?updateTotalVol=${newRow.totalVol}&updateItemName=${newRow.itemName}`;
        // Make the PUT request
        await axios.put(url, newRow);
        // If the request is successful, set the snackbar message
        setSnackbar({ children: 'Row updated successfully', severity: 'success' });
        // Return the updated row data
        return newRow;
      } catch (error) {
        // If there's an error, handle it here
        console.error('Error updating row:', error);
        throw error;
      }
    },
    [],
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  return (
    <Card style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
      <Box>
        <DataGrid 
          rows={rows}
          columns={columns}
          getRowId={(row) => row.recordDetailId} slots={{ toolbar: GridToolbar }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Box>
    </Card>
  );
}

ExportDefaultToolbar.propTypes = {
  data: PropTypes.array.isRequired,
};