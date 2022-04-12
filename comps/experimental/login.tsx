import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/Login.module.css';
import logo from '../../assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import { supabase } from '../../utils/supabaseClient';
import { LoginProps } from '../../types';

export default function Login({ handleClose }: LoginProps) {
  const [currentModule, setCurrentModule] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  async function signout() {
    const { error } = await supabase.auth.signOut();
    handleClose();
  }

  // function handleModuleChange(e:React.MouseEvent<HTMLElement>):void {
  //   setCurrentModule(e.target.innerHTML);
  //   const btns = Array.from(
  //     document.getElementsByClassName('module-toggle-btn') as HTMLCollectionOf<HTMLElement>    );

  //   for (const btn of btns) {
  //     btn.style.background = 'black';
  //     btn.style.color = 'white';
  //   }

  //   e.target.style.background = 'white';
  //   e.target.style.color = 'black';
  // }

  // function handleSubmit(e) {
  //   e.preventDefault();
  // }

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
                {/* <input
                    type='email'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                  /> */}
                <h3
                  style={{
                    color: 'white',
                    textTransform: 'uppercase',
                    fontFamily: 'Montserrat',
                  }}
                >
                  Login
                </h3>
                <div className={styles.loginOptions}>
                  <GoogleIcon
                    sx={{ color: 'white' }}
                    onClick={() => signInWithSupabase('google')}
                  />
                  <FacebookIcon
                    sx={{ color: 'white' }}
                    onClick={() => signInWithSupabase('facebook')}
                  />
                  <TwitterIcon
                    sx={{ color: 'white' }}
                    onClick={() => signInWithSupabase('twitter')}
                  />
                </div>

                {/* <button onClick={handleSubmit}>
                    {currentModule === 'login' ? 'Login' : 'Register'}
                  </button> */}
              </form>
              {/* <div className={styles.toggleModule}>
                <button
                  className='module-toggle-btn'
                  onClick={handleModuleChange}
                >
                  login
                </button>
                <button
                  className='module-toggle-btn'
                  onClick={handleModuleChange}
                >
                  register
                </button>
              </div> */}
            </>
          )}
        </div>
      </div>
    </>
  );
}
