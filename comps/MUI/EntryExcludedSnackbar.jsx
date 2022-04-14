import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProps } from '../../types';

export default function EntryExcludedSnackbar({ openSnackbar, closeSnackbar }) {
  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        sx={{
          textTransform: 'none',
        }}
        message='Entry excluded (you can hide the excluded entries in the filter options).'
        action={action}
      />
    </div>
  );
}
