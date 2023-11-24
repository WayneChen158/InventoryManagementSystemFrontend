import { Card, Container, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
import Scrollbar from "src/components/scrollbar";
import RequestTableHead from "../request-table-head";
import RequestTableEmptyRows from "../request-table-empty-rows";
import { useEffect, useRef, useState } from "react";
import { getRequestsURL } from "src/utils/url-provider";
import { applyFilter, getComparator } from "../utils";
import RequestTableRow from "../request-table-row";

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
    
    const handleSelectAllClick = () => {
        console.log("Checked");
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
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
        { id: 'description', label: 'Item Description'},
        { id: 'project', label: 'Project'},
        { id: 'purpose', label: 'Purpose'},
        { id: 'request-amount', label: 'Requested Amount'},
        { id: 'price-per-unit', label: 'Unit Price'},
        { id: 'request-by', label: 'Request By'},
        { id: 'request-date', label: 'Request Date'},
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
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={tableHeader}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <RequestTableRow 
                                            key={row.requestId}
                                            selected={selected.indexOf(row.id) !== -1}
                                            itemDescription={row.itemDescription}
                                            project={row.project}
                                            purpose={row.purpose === 1 ? 'R&D' : 'MFR'}
                                            requestAmount={row.requestAmount}
                                            pricePerUnit={row.pricePerUnit}
                                            requestBy={row.requestBy}
                                            requestDate={dateParser(row.requestDate)}
                                            handleClick={(event) => handleClick(event, row.id)}
                                        />
                                    ))}
                                <RequestTableEmptyRows 
                                    height={77}
                                    emptyRows={5}
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