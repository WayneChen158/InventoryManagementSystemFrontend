import { useRef, useState, useEffect } from 'react';

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

import { getRawMaterialsURL } from 'src/utils/url-provider';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import NewItemForm from '../components/NewItemForm';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function InventoryPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [inventoryData, setInventoryData] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  const rawMaterialsURL = useRef(getRawMaterialsURL());
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev * (-1));
  }
  
  useEffect(() => {
    fetch(rawMaterialsURL.current)
    .then(res => res.json())
    .then(data => {
      console.log("Raw Material Fetch Invoked!")
      console.log(data)
      setInventoryData(data)
    })
  }, [refreshTrigger]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = inventoryData.map((n) => n.id);
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
    inputData: inventoryData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Inventory</Typography>

        {/* {button onClick need to be implemented} */}
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          New Item
        </Button>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
        >
          <Box style={{ display: 'flex', margin: 'auto', justifyContent: 'center', width: '70%', height: '100%'}}>
            <NewItemForm 
              handleCloseModal={handleCloseModal}
              triggerRefresh={triggerRefresh}
            />
          </Box>
        </Modal> 
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={inventoryData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'description', label: 'Item Name' },
                  { id: 'catalogNumber', label: 'Catalog Number' },
                  { id: 'manufacturer', label: 'Vendor' },
                  { id: 'groupName', label: 'Type' },
                  { id: 'owner', label: 'Owner' },
                  { id: 'location', label:'Location'},
                  { id: 'amountInStock', label: 'Amount In Stock', align: 'center' },
                  { id: 'lowInStock', label: 'Low In Stock' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.materialId}
                      materialId={row.materialId}
                      name={row.description}
                      website={row.website}
                      catalog={row.catalogNumber}
                      vendor={row.manufacturer}
                      type={row.groupName === 1 ? 'Chemical' : 'Oligo'}
                      owner={row.owner}
                      location={row.location}
                      amountInStock={row.amountInStock}
                      LowInStock={row.amountInStock > row.threshold ? 'Enough' : 'Low'}
                      selected={selected.indexOf(row.materialId) !== -1}
                      handleClick={(event) => handleClick(event, row.materialId)}
                      triggerRefresh={triggerRefresh}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, inventoryData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={inventoryData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
