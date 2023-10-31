import * as React from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks({label, options, selected, onSelectionChange}) {

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onSelectionChange(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: '200px' }}>
        <InputLabel id={`demo-multiple-checkbox-${label}`}>{label}</InputLabel>
        <Select
          labelId={`demo-multiple-checkbox-${label}`}
          id={`demo-multiple-checkbox-${label}`}
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={() => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selected.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

MultipleSelectCheckmarks.propTypes = {
    label: PropTypes.string.isRequired, // Add this line
    options: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
  };