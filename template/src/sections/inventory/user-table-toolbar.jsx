import { useState } from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

import FilterCheckBox from './components/Checkmark';

// ----------------------------------------------------------------------

//  lowStock, onLowStockChange, selectedFilters, onSelectedFiltersChange 
export default function UserTableToolbar({ 
  numSelected, 
  filterName, 
  onFilterName,
  filterCatalog,
  onFilterCatalog,
  filterManufacturer,
  onFilterManufacturer,
  filterOwner,
  onFilterOwner,
  onFilterItemType,
}) {

  const itemTypeOptions = ["Chemical", "Oligo", "Re-sale Item"];
  
  const [selectedItemType, setSelectedItemType] = useState([]);

  const handleItemTypeChange = (selectedTypes) => {
    setSelectedItemType(selectedTypes);
    if (onFilterItemType !== undefined) {
      onFilterItemType(selectedTypes);
    }
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >

      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search name..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected === 0 && (
        <OutlinedInput 
          value={filterCatalog}
          onChange={onFilterCatalog}
          placeholder="Search catalog..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected === 0 && (
        <OutlinedInput 
          value={filterManufacturer}
          onChange={onFilterManufacturer}
          placeholder="Search vendor..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected === 0 && (
        <OutlinedInput 
          value={filterOwner}
          onChange={onFilterOwner}
          placeholder="Search owner..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected === 0 &&
          <FilterCheckBox
          label="Item type"
          options={itemTypeOptions}
          selected={selectedItemType}
          onSelectionChange={handleItemTypeChange}
        />
        }

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterCatalog: PropTypes.string,
  onFilterCatalog: PropTypes.func,
  filterManufacturer: PropTypes.string,
  onFilterManufacturer: PropTypes.func,
  filterOwner: PropTypes.string,
  onFilterOwner: PropTypes.func,
  onFilterItemType: PropTypes.func,
};
