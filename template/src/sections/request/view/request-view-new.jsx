import { useRef, useState, useEffect } from "react";

import { Card, Table, Container, TableBody, TableContainer, TablePagination } from "@mui/material";

import { getRequestsURL } from "src/utils/url-provider";

import Scrollbar from "src/components/scrollbar";

import RequestTableRow from "../request-table-row";
import RequestTableHead from "../request-table-head";
import RequestTableEmptyRows from "../request-table-empty-rows";
import { emptyRows, applyFilter, getComparator } from "../utils";

export default function RequestPurchasePageNew() {
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selected, setSelected] = useState([]);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('requestDate');

    const [filterName, setFilterName] = useState('');

    const [ requestData, setRequestData ] = useState([]);

    const requestsURL = useRef(getRequestsURL());

    useEffect(() => {
        fetch(requestsURL.current)
        .then(res => res.json())
        .then(data => {
            console.log("Request Fetch Invoked!");
            console.log(data);
            setRequestData(data);
        })
    }, []);

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

    const tableHeader = [
        { id: 'itemDescription', label: 'Item Description'},
        { id: 'project', label: 'Project'},
        { id: 'purpose', label: 'Purpose'},
        { id: 'requestAmount', label: 'Requested Amount'},
        { id: 'pricePerUnit', label: 'Unit Price'},
        { id: 'requestBy', label: 'Request By'},
        { id: 'requestDate', label: 'Request Date'},
    ];

    return (
        <Container>
            <Card>
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
                                            key={row.requestId}
                                            selected={selected.indexOf(row.requestId) !== -1}
                                            itemDescription={row.itemDescription}
                                            project={row.project}
                                            purpose={row.purpose === 1 ? 'R&D' : 'MFR'}
                                            requestAmount={row.requestAmount}
                                            pricePerUnit={row.pricePerUnit}
                                            requestBy={row.requestBy}
                                            requestDate={dateParser(row.requestDate)}
                                            handleClick={(event) => handleClick(event, row.requestId)}
                                        />
                                    ))}
                                <RequestTableEmptyRows 
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, requestData.length)}
                                />
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