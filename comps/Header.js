import React from "react";
import styles from "../styles/Header.module.css";
import logo from "../assets/logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <nav id={styles.navbar}>
      <div>
        <Image src={logo} alt="Logo" height={200} width={300} />
      </div>
      <ul>
        <li>Movies</li>
        <li>Games</li>
        <li>Books</li>
        <li>Comics</li>
        <li>Series</li>
        <li>Login</li>
      </ul>
    </nav>
  );
};

export default Header;
