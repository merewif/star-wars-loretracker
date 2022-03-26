import React from "react";
import styles from "../styles/Header.module.css";
import logo from "../assets/logo.png";
import Image from "next/image";
import Link from "next/link";

const Header = ({ displayData }) => {
  const listElements = ["Movies", "Books", "Comics", "Series"];

  return (
    <nav id={styles.navbar}>
      <div id={styles.image}>
        <Image src={logo} alt="Logo" height={100} width={150} />
      </div>
      <ul>
        {listElements.map((e, i) => {
          return (
            <li
              onClick={(e) => displayData(e)}
              key={i}
              id={listElements[i].toLowerCase()}
              className="navbtn"
            >
              {listElements[i]}
            </li>
          );
        })}
        {/* <Link href="/login">
          <li>Login</li>
        </Link> */}
        <li></li>
      </ul>
    </nav>
  );
};

export default Header;

//  <ThemeSwitcher />
