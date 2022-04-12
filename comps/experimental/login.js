import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Login.module.css';
import logo from '../../assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import RedditIcon from '@mui/icons-material/Reddit';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Login() {
  const [currentModule, setCurrentModule] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const { data: session } = useSession();

  function handleModuleChange(e) {
    setCurrentModule(e.target.innerHTML);
    const btns = document.getElementsByClassName('module-toggle-btn');
    for (const btn of btns) {
      btn.style.background = 'black';
      btn.style.color = 'white';
    }

    e.target.style.background = 'white';
    e.target.style.color = 'black';
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (currentModule === 'register') register();
    if (currentModule === 'login') login();
  }

  return (
    <>
      <Head>
        <title>Star Wars Loretracker</title>
        <meta
          name='description'
          content='Track which Star Wars content you consooomed.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Image src={logo} alt='Logo' height={200} width={300} />
          </div>
          {session ? (
            <div className={styles.loggedIn}>
              Signed in as {session.user.email} <br />
              {console.log(session.user)}
              <button onClick={() => signOut()}>Sign out</button>
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
                    onClick={() => signIn('google')}
                  />
                  <FacebookIcon
                    sx={{ color: 'white' }}
                    onClick={() => signIn('facebook')}
                  />
                  <TwitterIcon
                    sx={{ color: 'white' }}
                    onClick={() => signIn('twitter')}
                  />
                  <RedditIcon
                    sx={{ color: 'white' }}
                    onClick={() => signIn('reddit')}
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
