import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getShippedInvoicesURL } from 'src/utils/url-provider';

import Scrollbar from 'src/components/scrollbar';

import { config } from '../../../config';
import InvoiceTableHead from '../invoice-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import InvoiceTableRow from '../invoice-table-row';

// ----------------------------------------------------------------------

export default function ShippedInvoicePage({triggerFetch, refreshData}) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  const [openModal, setOpenModal] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [unshippedInvoiceList, setUnshippedInvoiceList] = useState([]);

  const getShippedInvoicesRequestURL = useRef(getShippedInvoicesURL());

  useEffect(() => {
    fetch(getShippedInvoicesRequestURL.current, { method: 'GET' })
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
    inputData: unshippedInvoiceList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

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
                      handleOperation={refreshData}
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

ShippedInvoicePage.propTypes = {
  triggerFetch: PropTypes.any,
  refreshData: PropTypes.func,
};