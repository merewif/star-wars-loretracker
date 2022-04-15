import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFilterContext } from '../../utils/useFilterContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function ListOfExcludedEntriesDialog() {
  const { removeFromExcluded, entriesMarkedAsExcluded } = useFilterContext();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        variant='outlined'
        onClick={handleClickOpen}
        sx={{ color: 'white', margin: '15px', marginLeft: '20px' }}
      >
        Edit excluded entries
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <Box
          sx={{
            backgroundColor: 'black',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <DialogTitle
            sx={{
              textTransform: 'uppercase',
              fontFamily: 'Montserrat',
              color: 'black',
              fontWeight: 900,
              paddingTop: '40px',
              textAlign: 'center',
              color: '#ffe81f',
            }}
          >
            {'Excluded content'}
          </DialogTitle>
          <DialogContent>
            {Object.keys(entriesMarkedAsExcluded).map((e1, i1) => {
              return (
                <Box key={i1}>
                  <Typography
                    variant='p'
                    sx={{
                      textTransform: 'uppercase',
                      fontFamily: 'Montserrat',
                      color: '#ffe81f',
                      fontWeight: 900,
                    }}
                  >
                    {e1}
                  </Typography>
                  {entriesMarkedAsExcluded[e1].length ? (
                    entriesMarkedAsExcluded[e1].map((e2, i2) => {
                      return (
                        <Box
                          key={i2}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: '30vw',
                          }}
                        >
                          <Tooltip title='Remove' placement='left'>
                            <DoDisturbOnIcon
                              sx={{
                                color: 'red',
                                fontSize: '1rem',
                                marginRight: '10px',
                                cursor: 'pointer',
                              }}
                              onClick={() => removeFromExcluded(e1, e2)}
                            />
                          </Tooltip>
                          <Typography
                            sx={{
                              color: 'white',
                              fontFamily: 'Montserrat',
                              marginBlock: '0',
                            }}
                          >
                            {e2.replace(/-+/g, ' ').replace(/—/g, '-')}
                          </Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: '50vw',
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'white',
                          fontFamily: 'Montserrat',
                          marginBlock: '0',
                        }}
                      >
                        Nothing excluded yet.
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
}
