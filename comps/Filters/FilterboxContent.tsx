import React from 'react';
import Popover from '@mui/material/Popover';
import ListOfExcludedEntriesDialog from '../MUI/ListOfExcludedEntriesDialog';
import Typography from '@mui/material/Typography';
import FilterByCanonicity from './FilterByCanonicity';
import FilterByFinished from './FilterByFinished';
import FilterByCreators from './FilterByCreators';
import FilterByCategories from './FilterByCategories';
import FilterExcludedEntries from './FilterExcludedEntries';
import ResetFilters from './ResetFilters';
import styles from '../../styles/Home.module.css';
import { useFilterContext } from '../../utils/useFilterContext';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterboxContent() {
  const { categories, filterboxAnchorEl, setFilterboxAnchorEl } =
    useFilterContext();

  return (
    <Popover
      id={'simple-popover'}
      open={Boolean(filterboxAnchorEl)}
      anchorEl={filterboxAnchorEl}
      onClose={() => setFilterboxAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <IconButton
        aria-label='close'
        onClick={() => setFilterboxAnchorEl(null)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#808080',
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box id={styles.filterbox}>
        <Typography
          variant='h5'
          gutterBottom
          component='div'
          sx={{
            fontFamily: 'Montserrat',
            fontWeight: 900,
            textAlign: 'center',
          }}
        >
          FILTERS
        </Typography>
        <FilterExcludedEntries />
        <ListOfExcludedEntriesDialog />

        <Box
          sx={{
            marginLeft: '15px',
            textAlign: 'center',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <FilterByCanonicity />
          <FilterByFinished />
        </Box>
        <FilterByCreators />
        {categories.length ? <FilterByCategories /> : null}
        <ResetFilters />
      </Box>
    </Popover>
  );
}
