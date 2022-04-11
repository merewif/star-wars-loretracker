import '../styles/globals.css';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

function StarWarsLoretracker({ Component, pageProps }) {
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
