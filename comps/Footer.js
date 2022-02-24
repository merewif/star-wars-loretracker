import React from "react";
import styles from "../styles/Footer.module.css";
import footerimg from "../public/imgs/footerimg.png";
import Image from "next/image";

const Footer = () => {
  return (
    <div id={styles.footer}>
      <div id={styles.container} style={{ display: "flex" }}>
        <div></div>
        <div>
          <Image src={footerimg} width="757" height="190" />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Footer;
