import PropTypes from 'prop-types';

import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from "@mui/material";

import { visuallyHidden } from './utils';

export default function RequestTableHead({
    order,
    orderBy,
    rowCount,
    numSelected,
    headLabel,
    onRequestSort,
    onSelectAllClick,})
{
    const onSort = (property) => (event) => {
        onRequestSort(event, property);
    }
    
    return(
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox 
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>

                {headLabel.map((headCell) => (
                    <TableCell 
                        key={headCell.id}
                        align={headCell.align || 'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={onSort(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

RequestTableHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    rowCount: PropTypes.number,
    numSelected: PropTypes.number,
    headLabel: PropTypes.array,
    onRequestSort: PropTypes.func,
    onSelectAllClick: PropTypes.func,
}