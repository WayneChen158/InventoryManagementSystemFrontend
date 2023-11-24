import PropTypes from 'prop-types';

import { Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from "@mui/material";

export default function RequestTableHead({
    order,
    orderBy,
    headLabel,
    onSelectAllClick,})
{
    return(
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox 
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
                        >
                            {headCell.label}
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
    headLabel: PropTypes.array,
    onSelectAllClick: PropTypes.func,
}