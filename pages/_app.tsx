import '../styles/globals.css';
import React from 'react';
import ReactGA from 'react-ga';
import { AppProps } from 'next/app';

function StarWarsLoretracker({ Component, pageProps }: AppProps) {
  ReactGA.initialize('G-WEW3SZLHC9');
  if (typeof window !== 'undefined') {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  return (
    <div id='appContainer'>
      <Component {...pageProps} />
    </div>
  );
}

export default StarWarsLoretracker;
