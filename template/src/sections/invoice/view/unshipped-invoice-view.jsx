import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getUnshippedInvoicesURL } from 'src/utils/url-provider';

import Scrollbar from 'src/components/scrollbar';

import TableEmptyRows from '../table-empty-rows';
import InvoiceTableRow from '../invoice-table-row';
import InvoiceTableHead from '../invoice-table-head';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UnshippedInvoicePage({triggerFetch, refreshData}) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  // const [openModal, setOpenModal] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [unshippedInvoiceList, setUnshippedInvoiceList] = useState([]);

  const getUnshippedInvoicesRequestURL = useRef(getUnshippedInvoicesURL());

  useEffect(() => {
    fetch(getUnshippedInvoicesRequestURL.current, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resdata) => {
        console.log(resdata)
        setUnshippedInvoiceList(resdata);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [refreshTrigger, triggerFetch]);

  // const handleOpenModal = () => {
  //   setOpenModal(true);
  // };

  // const handleCloseModal = () => {
  //   setOpenModal(false);
  // };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev * (-1));
    refreshData();
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
    inputData: unshippedInvoiceList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <Container>

      <Card>
        <InvoiceTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <InvoiceTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'invoiceNumber', label: 'Invoice#' },
                  { id: 'invoiceDate', label: 'Invoice Date' },
                  { id: 'shipDate', label: 'Ship Date' },
                  { id: 'trackingNumber', label: 'Tracking' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <InvoiceTableRow
                      key={row.invoiceId}
                      invoice={row}
                      page='unshipped'
                      handleOperation={triggerRefresh}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />

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
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

UnshippedInvoicePage.propTypes = {
  triggerFetch: PropTypes.any,
  refreshData: PropTypes.func,
};
