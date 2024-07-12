import { useState, useEffect, useRef } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Box, Modal } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getCustomersURL  } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import CustomerTableRow from '../customer-table-row';
import CustomerTableHead from '../customer-table-head';
import TableEmptyRows from '../table-empty-rows';
import CustomerForm from '../components/customer-form';
import CustomerTableToolbar from '../customer-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function CustomerPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  const [openModal, setOpenModal] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [customerData, setCustomerData] = useState([]);

  const customerListURL = useRef(getCustomersURL());

  useEffect(() => {
    fetch(customerListURL.current, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        console.log(resdata)
        setCustomerData(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [refreshTrigger]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev * (-1));
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: customerData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Customers</Typography>

        <Button 
          variant="contained" 
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          New Customer
        </Button>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
        >
          <Box 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh'
            }}
          >
            <Card style={{ width: '70%', padding: '20px' }}>
              <CustomerForm 
                currentInfo={null}
                handleCloseModal={handleCloseModal}
                triggerRefresh={triggerRefresh}
              />
            </Card>
          </Box>
        </Modal> 

      </Stack>

      <Card>
        <CustomerTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomerTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'customerName', label: 'Name' },
                  { id: 'company', label: 'Company' },
                  { id: 'phoneNumber', label: 'Phone' },
                  { id: 'emailAddress', label: 'Email' },
                  { id: 'shippingAddress', label: 'Shipping' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CustomerTableRow
                      key={row.customerId}
                      customer={row}
                      triggerRefresh={triggerRefresh}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

