import "../styles/globals.css";
import React from "react";

function StarWarsLoretracker({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default StarWarsLoretracker;
