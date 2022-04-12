import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import logo from '../../assets/logo.png';
import Image from 'next/image';
import Button from '@mui/material/Button';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { supabase } from '../../utils/supabaseClient';
import { LoginProps } from '../../types';

export default function Login({ handleClose }: LoginProps) {
  const [email, setEmail] = useState('');

  const session = supabase.auth.session();
  const user = supabase.auth.user();

  async function signInWithSupabase(provider: string) {
    if (provider === 'facebook') {
      const { user, session, error } = await supabase.auth.signIn({
        provider: 'facebook',
      });
    }
    if (provider === 'twitter') {
      const { user, session, error } = await supabase.auth.signIn({
        provider: 'twitter',
      });
    }
    if (provider === 'google') {
      const { user, session, error } = await supabase.auth.signIn({
        provider: 'google',
      });
    }
  }

  async function signInWithEmail() {
    const { user, error } = await supabase.auth.signIn({
      email: email,
    });
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
              <button onClick={() => signout()}>Sign out</button>
            </div>
          ) : (
            <>
              <form className={styles.form}>
                <Button
                  variant='outlined'
                  startIcon={<FacebookIcon />}
                  onClick={() => signInWithSupabase('facebook')}
                >
                  Login with Facebook
                </Button>
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
                <input
                  type='email'
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button startIcon={<EmailIcon />} onClick={signInWithEmail}>
                  Login with email
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
