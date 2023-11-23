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
  numSelected, filterName, onFilterName
}) {

  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState([]);

  const handleLocationChange = (selectedOptions) => {
    setSelectedLocation(selectedOptions);
  };

  const handleTypeChange = (selectedOptions) => {
    setSelectedType(selectedOptions);
  };

  const handleOwnerChange = (selectedOptions) => {
    setSelectedOwner(selectedOptions);
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
          placeholder="Search item..."
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
          label="Location"
          options={['Location 1', 'Location 2', 'Location 3']}
          selected={selectedLocation}
          onSelectionChange={handleLocationChange}
        />
        }

      {numSelected === 0 &&
          <FilterCheckBox
          label="Type"
          options={['Type 1', 'type 2', 'Type 3']}
          selected={selectedType}
          onSelectionChange={handleTypeChange}
        />
        }

      {numSelected === 0 &&
          <FilterCheckBox
          label="Owner"
          options={['Owner 1', 'Owner 2', 'Owner 3']}
          selected={selectedOwner}
          onSelectionChange={handleOwnerChange}
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
};
