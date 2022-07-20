import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DescriptionDialogProps } from '../../types';
import styles from "../../styles/Home.module.css"
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function DescriptionDialog({ title, description }: DescriptionDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <div className={styles.descriptionButtonContainer} onClick={handleClickOpen()}>
        <h6 className={styles.descriptionLabel}><FontAwesomeIcon icon={faCircleInfo} /> View Description</h6>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'body'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <div className={styles.descriptionContainer}>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#808080',
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle sx={{backgroundColor: '#ffe81f', color: 'black', fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', paddingInline: '50px' }} id="scroll-dialog-title" className={styles.descriptionDialogTitle}>{ title }</DialogTitle>
          <DialogContent dividers={true}>
              <div className={styles.descriptionWarning}>Description provided by Google Books.</div>
              <div lang='en' className={styles.descriptionText}>{ description }</div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
