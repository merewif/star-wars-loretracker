import React from 'react';
import { useFilterContext } from '../../utils/useFilterContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

export default function FilterByCategories() {
  const { filteredCategories, filterEntries, categories } = useFilterContext();
  return (
    <Box>
      <FormControl
        sx={{ m: 1, width: 500, maxWidth: '80vw', minWidth: 'none' }}
      >
        <InputLabel>Categories</InputLabel>
        <Select
          multiple
          value={filteredCategories}
          onChange={(e) => {
            filterEntries(e.target.value, 'categories');
          }}
          input={<OutlinedInput label='Categories' />}
          renderValue={(selected) => selected.join(', ')}
        >
          {categories.map((name: string) => (
            <MenuItem key={name} value={name} sx={{ maxWidth: '80vw' }}>
              <Checkbox checked={filteredCategories.indexOf(name) > -1} />
              <ListItemText primary={name} sx={{ maxWidth: '80vw' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
