import React, { useState } from 'react';
import styles from '../styles/Header.module.css';
import logo from '../assets/logo.png';
import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { HeaderProps } from '../types';
import Login from './Login';
import About from './About';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const Header = ({ displayData, handleFileRead }: HeaderProps) => {
  const listElements = ['Movies', 'Books', 'Comics', 'Series'];
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<string>('');

  const handleClickOpen = (dialogTarget: string) => {
    setDialogContent(dialogTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function uploadBackup(event: React.ChangeEvent<HTMLInputElement>) {
    let reader = new FileReader();
    reader.readAsText(event.target.files![0]);
    reader.onload = handleFileRead;
  }

  function downloadBackup() {
    let storedCollection = localStorage.getItem('loretracker') ?? '';
    let collection = JSON.parse(storedCollection) ?? {};
    let collectionAsText = JSON.stringify(collection);

    let a = document.createElement('a');
    a.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(collectionAsText)
    );
    a.setAttribute('download', 'my-star-wars-loretracker-collection.sw');
    a.click();
  }

  return (
    <>
      <nav id={styles.navbar}>
        <div id={styles.image}>
          <Image src={logo} alt='Logo' height={100} width={150} />
        </div>
        <ul>
          {listElements.map((e, i) => {
            return (
              <li
                onClick={(e) => displayData(listElements[i].toLowerCase())}
                key={i}
                id={listElements[i].toLowerCase()}
                className='navbtn'
              >
                {listElements[i]}
              </li>
            );
          })}

          <li onClick={() => handleClickOpen('about')}>About & Backup</li>
          <li
            onClick={() => handleClickOpen('login')}
            style={{ paddingLeft: '0px' }}
          >
            <AccountCircleIcon sx={{ color: '#ffe81f ' }} />
          </li>
        </ul>
      </nav>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
        sx={{
          maxHeight: 'none',
          maxWidth: 'none',
        }}
      >
        {dialogContent === 'about' ? (
          <About
            handleClose={handleClose}
            uploadBackup={uploadBackup}
            downloadBackup={downloadBackup}
          />
        ) : (
          <Login handleClose={handleClose} />
        )}
      </Dialog>
    </>
  );
};

export default Header;

//  <ThemeSwitcher />
