import PropTypes from 'prop-types';

import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

export default function RequestTableHead({
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
    headLabel: PropTypes.array,
    onSelectAllClick: PropTypes.func,
}