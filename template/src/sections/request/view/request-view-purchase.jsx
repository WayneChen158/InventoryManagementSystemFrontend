import { useState } from "react";
import PropTypes from 'prop-types';

import { Card, Table, Container, TableBody, TableContainer, TablePagination } from "@mui/material";

import Scrollbar from "src/components/scrollbar";

import TableNoData from "src/sections/user/table-no-data";

import RequestTableRow from "../request-table-row";
import RequestTableHead from "../request-table-head";
import RequestTableToolbar from "../request-table-toolbar";
import RequestTableEmptyRows from "../request-table-empty-rows";
import { emptyRows, applyFilter, getComparator } from "../utils";

export default function RequestPurchasePage({
    allRequestData,
    triggerRefresh,
    statusCodes,
    categoryCode,
}) {
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selected, setSelected] = useState([]);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('requestDate');

    const [filterName, setFilterName] = useState('');

    const requestData = allRequestData.filter((request) => ((statusCodes.includes(request.status)) && (request.requestCategory === categoryCode)));

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    }
    
    const handleSelectAllClick = (event) => {
        // console.log("Checked");
        if (event.target.checked) {
            const newSelecteds = requestData.map((request) => request.requestId);
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

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    }

    const dateParser = (mysqlDateStr) => {
        if (mysqlDateStr === null) {
            return 'Unknown';
        }
        const mysqlDate = new Date(mysqlDateStr);
        return mysqlDate.toLocaleDateString('en-US');
    };

    const dataFiltered = applyFilter({
        inputData: requestData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    let tableHeader = [];

    if (statusCodes.includes(1)) {
        tableHeader = [
            { id: 'itemDescription', label: 'Item Description'},
            { id: 'itemCatalog', label: 'Catalog Number'},
            { id: 'project', label: 'Project'},
            { id: 'purpose', label: 'Purpose'},
            { id: 'requestAmount', label: 'Requested Amount'},
            { id: 'pricePerUnit', label: 'Unit Price'},
            { id: 'requestBy', label: 'Requested By'},
            { id: 'requestDate', label: 'Request Date'},
            { id: 'actionButton', label: ''},
        ];
    } else if (statusCodes.includes(2)) {
        tableHeader = [
            { id: 'itemDescription', label: 'Item Description'},
            { id: 'itemCatalog', label: 'Catalog Number'},
            { id: 'purpose', label: 'Purpose'},
            { id: 'requestAmount', label: 'Requested Amount'},
            { id: 'fulfilledAmount', label: 'Ordered Amount'},
            { id: 'receivedAmount', label: 'Received Amount'},
            { id: 'requestBy', label: 'Requested By'},
            { id: 'doneBy', label: 'Ordered By'},
            { id: 'receivedBy', label: 'Received By'},
            { id: 'requestDate', label: 'Request Date'},
            { id: 'fulfilledDate', label: 'Ordered Date'},
            { id: 'receivedDate', label: 'Partially Received Date'},
            { id: 'orderStatus', label: 'Order Status'},
            { id: 'actionButton', label: ''},
        ];
    } else {
        tableHeader = [
            { id: 'itemDescription', label: 'Item Description'},
            { id: 'itemCatalog', label: 'Catalog Number'},
            { id: 'purpose', label: 'Purpose'},
            { id: 'requestAmount', label: 'Requested Amount'},
            { id: 'fulfilledAmount', label: 'Ordered Amount'},
            { id: 'receivedAmount', label: 'Received Amount'},
            { id: 'requestBy', label: 'Requested By'},
            { id: 'doneBy', label: 'Ordered By'},
            { id: 'receivedBy', label: 'Received By'},
            { id: 'requestDate', label: 'Request Date'},
            { id: 'fulfilledDate', label: 'Ordered Date'},
            { id: 'receivedDate', label: 'Received Date'},
        ];
    }

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container>
            <Card>
                <RequestTableToolbar 
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <RequestTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={requestData.length}
                                numSelected={selected.length} 
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleSort}
                                headLabel={tableHeader}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <RequestTableRow
                                            status={row.status} 
                                            key={row.requestId}
                                            selected={selected.indexOf(row.requestId) !== -1}
                                            requestId={row.requestId}
                                            itemDescription={row.itemDescription}
                                            itemCatalog={row.itemCatalog}
                                            itemURL={row.itemURL}
                                            project={row.project}
                                            purpose={
                                                (() => {
                                                    switch (row.purpose) {
                                                      case 1:
                                                        return 'R&D';
                                                      case 2:
                                                        return 'MFG';
                                                      case 3:
                                                        return 'Re-sale';
                                                      default:
                                                        return 'Unknown';
                                                    }
                                                  })()
                                            }
                                            requestAmount={row.requestAmount}
                                            fulfilledAmount={row.fulfilledAmount}
                                            receivedAmount={row.receivedAmount}
                                            pricePerUnit={row.pricePerUnit}
                                            requestBy={row.requestBy}
                                            doneBy={row.doneBy}
                                            receivedBy={row.receivedBy}
                                            requestDate={dateParser(row.requestDate)}
                                            fulfilledDate={dateParser(row.fulfilledDate)}
                                            receivedDate={dateParser(row.receivedDate)}
                                            handleClick={(event) => handleClick(event, row.requestId)}
                                            triggerRefresh={triggerRefresh}
                                        />
                                    ))}
                                <RequestTableEmptyRows 
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, requestData.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination 
                    page={page}
                    component="div"
                    count={requestData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[10, 25, 50]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}

RequestPurchasePage.propTypes = {
    allRequestData: PropTypes.array.isRequired,
    triggerRefresh: PropTypes.func.isRequired,
    statusCodes: PropTypes.array.isRequired,
    categoryCode: PropTypes.number.isRequired,
}