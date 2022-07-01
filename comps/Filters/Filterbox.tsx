import React from 'react';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import styles from '../../styles/Home.module.css';
import { useFilterContext } from '../../utils/useFilterContext';
import Box from '@mui/material/Box';
import FilterboxContent from './FilterboxContent';

export default function Filterbox() {
  const { setFilterboxAnchorEl } = useFilterContext();

  return (
    <Box
      sx={{
        display: 'flex'
      }}
      className={styles.filterDiv}
    >
      <Button
        onClick={(e) => setFilterboxAnchorEl(e.currentTarget)}
        className={styles.filterboxButton}
        variant='outlined'
        startIcon={<FilterListIcon />}
        sx={{
          color: 'white',
          padding: '10px',
          minWidth: '100px',
          height: '2.5rem',
          marginBlock: 'auto',
          fontWeight: 900,
        }}
      >
        FILTER
      </Button>

      <FilterboxContent />
    </Box>
  );
}
