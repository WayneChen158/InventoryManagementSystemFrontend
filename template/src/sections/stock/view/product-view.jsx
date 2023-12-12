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
import TableEmptyRows from '../table-empty-rows';
import StockTableHead from '../stock-table-head';
import ProductTableRow from '../product-table-row';
import StockTableToolbar from '../stock-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils-products';

// ----------------------------------------------------------------------

export default function ProductPage({ productList }) {
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
      const newSelecteds = productList.map((n) => n.manufactureRecordId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
    inputData: productList,
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
                rowCount={productList.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'productCatalog', label: 'Catalog' },
                  { id: 'productName', label: 'Product Name' },
                  { id: 'manufactureDate', label: 'Date' },
                  { id: 'lotNumber', label: 'Lot#' },
                  { id: 'amountInStock', label: 'In Stock' },
                ]}
              />
              <TableBody>

                {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ProductTableRow
                        key={row.productRecordId}
                        catalog = {row.productCatalog}
                        name={row.productName}
                        date={row.manufactureDate}
                        lotNumber={row.lotNumber}
                        amountInStock={row.amountInStock}
                        unit={" "}
                        selected={selected.indexOf(row.id) !== -1}
                        handleClick={(event) => handleClick(event, row.id)}
                      />
                    ))}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, productList.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}

              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={productList.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

ProductPage.propTypes = {
  productList: PropTypes.array,
}
