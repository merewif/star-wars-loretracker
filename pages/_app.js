import "../styles/globals.css";
import React, { useEffect } from "react";

function StarWarsLoretracker({ Component, pageProps }) {
  return (
    <div id="appContainer">
      <Component {...pageProps} />
    </div>
  );
}

export default StarWarsLoretracker;
