import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import logo from '../../assets/logo.png';
import Image from 'next/image';
import Button from '@mui/material/Button';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../utils/supabaseClient';
import { LoginProps } from '../../types';
import { Provider } from '@supabase/supabase-js';

export default function Login({ handleClose }: LoginProps) {
  const [email, setEmail] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  const session = supabase.auth.session();
  const user = supabase.auth.user();

  async function signInWithSupabase(provider: Provider) {
    const { user, session, error } = await supabase.auth.signIn({
      provider: provider,
    });
  }

  function signInWithEmail(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    sendLoginMail();
  }

  async function sendLoginMail() {
    const { user, error } = await supabase.auth.signIn({
      email: email,
    });
    setOpenSnackbar(true);
  }

  async function signout() {
    const { error } = await supabase.auth.signOut();
    handleClose();
  }

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Image src={logo} alt='Logo' height={200} width={300} />
          </div>
          {user ? (
            <div className={styles.loggedIn}>
              Signed in as {user.email} <br />
              <Button startIcon={<LogoutIcon />} onClick={() => signout()}>
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <form
                className={styles.form}
                onSubmit={(e) => signInWithEmail(e)}
              >
                <Button
                  variant='outlined'
                  startIcon={<GoogleIcon />}
                  onClick={() => signInWithSupabase('google')}
                >
                  Login with Google
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<TwitterIcon />}
                  onClick={() => signInWithSupabase('twitter')}
                >
                  Login with Twitter
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<FacebookIcon />}
                  onClick={() => signInWithSupabase('facebook')}
                >
                  Login with Facebook
                </Button>
                <input
                  type='email'
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  onSubmit={(e) => signInWithEmail(e)}
                />

                <Button startIcon={<EmailIcon />} onClick={sendLoginMail}>
                  Login with email
                </Button>
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  message='We sent you an email with your login credentials.'
                  action={action}
                />
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
