import React from 'react';
import { useFilterContext } from '../../utils/useFilterContext';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';

export default function FilterByFinished() {
  const { finishedFilterValue, filterEntries } = useFilterContext();

  return (
    <Box
      sx={{
        marginLeft: '15px',
        textAlign: 'center',
      }}
    >
      <FormControl sx={{ display: 'flex' }}>
        <FormLabel
          sx={{
            display: 'flex',
          }}
        >
          Filter by Finished
        </FormLabel>
        <RadioGroup
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
          row
          aria-labelledby='radio-buttons-group-label'
          name='row-radio-buttons-group'
          value={finishedFilterValue}
          onChange={(e) => {
            filterEntries(e.target.value, 'finished');
          }}
        >
          <FormControlLabel value='all' control={<Radio />} label='All' />
          <FormControlLabel
            value='finished'
            control={<Radio />}
            label='Finished'
          />
          <FormControlLabel
            value='unfinished'
            control={<Radio />}
            label='Unfinished'
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
