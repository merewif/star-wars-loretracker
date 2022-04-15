import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import styles from '../../styles/Home.module.css';
import Box from '@mui/material/Box';
import { useFilterContext } from '../../utils/useFilterContext';

export default function FilterByCreators() {
  const { creators, filterEntries, filteredCreatorsName } = useFilterContext();

  return (
    <Box>
      <FormControl
        sx={{ m: 1, width: 500, maxWidth: '80vw', minWidth: 'none' }}
        className={styles.filterchecklist}
      >
        <InputLabel>Creators</InputLabel>
        <Select
          multiple
          value={filteredCreatorsName}
          onChange={(e) => {
            filterEntries(e.target.value, 'creators');
          }}
          input={<OutlinedInput label='Creators' />}
          renderValue={(selected) => selected.join(', ')}
        >
          {creators.map((name: string) => (
            <MenuItem key={name} value={name} sx={{ maxWidth: '80vw' }}>
              <Checkbox checked={filteredCreatorsName.indexOf(name) > -1} />
              <ListItemText primary={name} sx={{ maxWidth: '80vw' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
