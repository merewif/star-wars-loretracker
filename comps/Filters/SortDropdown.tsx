import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import _ from 'lodash';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import styles from '../../styles/Home.module.css';
import { useFilterContext } from '../../utils/useFilterContext';

export default function SortDropdown() {
  const [order, setOrder] = useState('asc');
  const [sortParameter, setSortParameter] = useState('title');

  useEffect(() => {
    setSortBy([sortParameter, order]);
  }, [order, sortParameter]);

  const { sortBy, setSortBy, moduleKeys } = useFilterContext();

  return (
    <Box
      sx={{
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        display: 'flex',
        alignItems: 'center',
      }}
      className={styles.sortByDropdown}
    >
      <FormControl sx={{ width: '200px' }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy[0]}
          label='Sort By'
          onChange={(e) => {
            setSortParameter(e.target.value);
          }}
        >
          {_.without(moduleKeys, 'coverImage', 'links').map((e, i) => {
            return (
              <MenuItem value={e} key={e}>
                {e.replace(/([A-Z])/g, ' $1').replace(/^./, function (e) {
                  return e.toUpperCase();
                })}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {order === 'asc' ? (
        <ArrowUpwardIcon
          onClick={() => setOrder('desc')}
          sx={{ fontSize: '2rem', cursor: 'pointer', color: 'white' }}
        />
      ) : (
        <ArrowDownwardIcon
          onClick={() => setOrder('asc')}
          sx={{ fontSize: '2rem', cursor: 'pointer', color: 'white' }}
        />
      )}
    </Box>
  );
}
