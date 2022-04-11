import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Login.module.css';
import logo from '../../assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth';
// import { auth } from "../.firebase/firebase-config";

export default function Login() {
  const [currentModule, setCurrentModule] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});

  function handleModuleChange(e) {
    setCurrentModule(e.target.innerHTML);
    const btns = document.getElementsByClassName('module-toggle-btn');
    for (const btn of btns) {
      btn.style.background = 'white';
      btn.style.color = 'black';
    }

    e.target.style.background = 'black';
    e.target.style.color = 'white';
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (currentModule === 'register') register();
    if (currentModule === 'login') login();
  }

  //   const register = async () => {
  //     try {
  //       const user = await createUserWithEmailAndPassword(auth, email, password);
  //     } catch (error) {
  //       console.log(error.message);
  //     }

  //     onAuthStateChanged(auth, (currentUser) => {
  //       if (currentUser) setUser(currentUser);
  //       if (!currentUser) setUser({});
  //     });
  //   };
  //   const login = async () => {
  //     try {
  //       const user = await signInWithEmailAndPassword(auth, email, password);
  //     } catch (error) {
  //       console.log(error.message);
  //     }

  //     onAuthStateChanged(auth, (currentUser) => {
  //       if (currentUser) setUser(currentUser);
  //       if (!currentUser) setUser({});
  //     });
  //   };

  //   const logout = async () => {
  //     await signOut(auth);

  //     onAuthStateChanged(auth, (currentUser) => {
  //       if (currentUser) setUser(currentUser);
  //       if (!currentUser) setUser({});
  //     });
  //   };
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
        <div>
          {user.email ? (
            <div>
              <p>Logged in as</p> {user?.email}
              <button onClick={logout}>Signout</button>
            </div>
          ) : (
            <>
              <div className={styles.loginBox}>
                <div className={styles.logoContainer}>
                  <Link href='/'>
                    <Image src={logo} alt='Logo' height={200} width={300} />
                  </Link>
                </div>
                <form>
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={handleSubmit}>
                    {currentModule === 'login' ? 'Login' : 'Register'}
                  </button>
                </form>
              </div>
              <div className={styles.toggleModule}>
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
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
