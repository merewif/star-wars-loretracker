import React from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/Header.module.css';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { AboutProps } from '../types';

export default function About({
  handleClose,
  uploadBackup,
  downloadBackup,
}: AboutProps) {
  return (
    <div className={styles.dialogContent}>
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
      <Image src={logo} alt='Logo' height={200} width={300} />
      <p>
        The site was developed using React and Next.js. The repository is
        available
        <a
          href='https://github.com/merewif/star-wars-loretracker'
          target='_blank'
          rel='noopener noreferrer'
        >
          here.
        </a>
        For feedback and bug reports kindly use the GitHub issues feature. Pull
        requests are welcome.
      </p>
      <p>
        The databases for the Star Wars books and comics were assembled by
        <a href='https://youtini.com' target='_blank' rel='noopener noreferrer'>
          the Youtini team.
        </a>
      </p>
      <p>
        If you want to use the Lortracker without logging in, you can import or
        export your collection, use the buttons below:
      </p>
      <div style={{ display: 'grid', gap: '10px' }}>
        <input
          onChange={(e) => uploadBackup(e)}
          type='file'
          hidden
          id='upload-backup'
        />
        <label htmlFor='upload-backup'>
          <Button
            component='span'
            variant='outlined'
            startIcon={<FileUploadIcon />}
            sx={{
              color: 'white',
              borderColor: 'white',
              padding: '10px',
              minWidth: '100px',
              height: '2.5rem',
              marginBlock: 'auto',
              width: '100%',
            }}
          >
            Upload backup
          </Button>
        </label>
        <Button
          onClick={downloadBackup}
          variant='outlined'
          startIcon={<DownloadIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            padding: '10px',
            minWidth: '100px',
            height: '2.5rem',
            marginBlock: 'auto',
          }}
        >
          Download backup
        </Button>
      </div>
      <p>
        Star Wars Loretracker is not affiliated, associated, authorized,
        endorsed by, or in any way officially connected with STAR WARS,
        Lucasfilm Ltd., The Walt Disney Company, Disney Enterprises Inc., or any
        of its subsidiaries or its affiliates. The official Star Wars website is
        available at
        <a
          href='http://www.starwars.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          www.starwars.com
        </a>
        . All Star Wars artwork, logos & properties belong to ©Lucasfilm LTD
      </p>
      <a
        style={{ fontSize: '8px', textTransform: 'uppercase', margin: '0' }}
        href='https://star-wars-loretracker.vercel.app/privacypolicy'
        target='_blank'
        rel='noopener noreferrer'
      >
        Privacy policy
      </a>{' '}
      -{' '}
      <a
        style={{ fontSize: '8px', textTransform: 'uppercase', margin: '0' }}
        href='https://star-wars-loretracker.vercel.app/termsofservice'
        target='_blank'
        rel='noopener noreferrer'
      >
        Terms of Service
      </a>
    </div>
  );
}
