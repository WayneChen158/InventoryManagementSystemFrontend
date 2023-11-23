import { Card, Container, Table, TableBody, TableContainer } from "@mui/material";
import Scrollbar from "src/components/scrollbar";
import RequestTableHead from "../request-table-head";
import RequestTableEmptyRows from "../request-table-empty-rows";
import { useEffect, useRef, useState } from "react";
import { getRequestsURL } from "src/utils/url-provider";

export default function RequestPurchasePageNew() {
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
    }

    return (
        <Container>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <RequestTableHead 
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'description', label: 'Item Description'},
                                    { id: 'project', label: 'Project'},
                                ]}
                            />
                            <TableBody>
                                <RequestTableEmptyRows 
                                    height={77}
                                    emptyRows={5}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                
                {/* <TablePagination
                    page={page}
                    component="div"
                    count={inventoryData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 20]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
            </Card>
        </Container>
    );
}