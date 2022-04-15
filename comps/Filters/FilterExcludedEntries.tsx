import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useFilterContext } from '../../utils/useFilterContext';

export default function FilterExcludedEntries() {
  const { hideExcludedEntries, filterEntries } = useFilterContext();
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
      }}
    >
      <FormControlLabel
        control={<Checkbox checked={hideExcludedEntries} />}
        label='Hide excluded entries'
        sx={{ marginLeft: '15px' }}
        onChange={(e: React.SyntheticEvent, checked: boolean) =>
          filterEntries(checked, 'hideExcluded')
        }
      />
    </Box>
  );
}
