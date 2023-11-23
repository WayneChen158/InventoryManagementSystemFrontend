import { TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';

export default function RequestTableEmptyRows({
    emptyRows,
    height
}) {
    if (!emptyRows) {
        return null;
    }
    
    return(
        <TableRow
        sx={{
            ...(height && {
              height: height * emptyRows,
            }),
          }}>
            <TableCell colSpan={9} />
        </TableRow>
    );
}

RequestTableEmptyRows.propTypes = {
    emptyRows: PropTypes.number,
    height: PropTypes.number,
}