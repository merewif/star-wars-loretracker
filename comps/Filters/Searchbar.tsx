import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import styles from '../../styles/Home.module.css';
import { Keyable } from '../../types';

export default function Searchbar({
  fetchedTitles,
  searchValue,
  setSearchValue,
  searchEntries,
}: Keyable) {
  return (
    <>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '40vw' },
        }}
        noValidate
        autoComplete='off'
        className={styles.searchbar}
      >
        <Autocomplete
          disablePortal
          freeSolo
          id='fullWidth'
          options={fetchedTitles}
          inputValue={searchValue}
          onInputChange={(e, newValue) => {
            setSearchValue(newValue);
            searchEntries(newValue);
          }}
          onChange={(e, newInputValue) => {
            searchEntries(newInputValue);
            setSearchValue(newInputValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label='Search by Title' />
          )}
          className={styles.autocomplete}
        />
      </Box>
    </>
  );
}