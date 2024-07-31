import { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import StockTableHead from '../stock-table-head';
import TableEmptyRows from '../table-empty-rows';
import ComponentTableRow from '../component-table-row';
import StockTableToolbar from '../stock-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils-products';

// ----------------------------------------------------------------------

export default function ComponentPage({ componentList }) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('date');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = componentList.map((n) => n.manufactureRecordId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
    inputData: componentList,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>

      <Card>
        <StockTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StockTableHead
                order={order}
                orderBy={orderBy}
                rowCount={componentList.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'componentCatalog', label: 'Catalog' },
                  { id: 'componentName', label: 'Component Name' },
                  { id: 'lotNumber', label: 'Lot#' },
                  { id: 'amountInStock', label: 'In Stock' },
                ]}
              />
              <TableBody>

                {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ComponentTableRow
                        key={row.componentRecordId}
                        catalog = {row.componentCatalog}
                        name={row.componentName}
                        lotNumber={row.lotNumber}
                        amountInStock={row.amountInStock}
                        unit = {row.unit}
                      />
                    ))}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, componentList.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}

              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={componentList.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

ComponentPage.propTypes = {
  componentList: PropTypes.array,
}