import React from 'react';
import Button from '@mui/material/Button';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import styles from '../../styles/Home.module.css';
import { useFilterContext } from '../../utils/useFilterContext';
import Box from '@mui/material/Box';

export default function ResetFilters() {
  const { resetFilters } = useFilterContext();
  return (
    <Box
      sx={{ width: '100%', textAlign: 'center' }}
      id={styles.filterResetBtnContainer}
    >
      <Button variant='contained' onClick={resetFilters}>
        <RotateLeftIcon /> Reset
      </Button>
    </Box>
  );
}
