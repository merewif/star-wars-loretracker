import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import logo from "../assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [currentModule, setCurrentModule] = useState("login");

  function handleModuleChange(e) {
    setCurrentModule(e.target.innerHTML);
    const btns = document.getElementsByClassName("module-toggle-btn");
    for (const btn of btns) {
      btn.style.background = "black";
      btn.style.color = "white";
    }

    e.target.style.background = "white";
    e.target.style.color = "black";
  }

  function handleSubmit() {}

  return (
    <>
      <div className={styles.loginContainer}>
        <div>
          <div className={styles.loginBox}>
            <div className={styles.logoContainer}>
              <Link href="/">
                <Image src={logo} alt="Logo" height={200} width={300} />
              </Link>
            </div>
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button onClick={handleSubmit}>
                {currentModule === "login" ? "Login" : "Register"}
              </button>
            </form>
          </div>
          <div className={styles.toggleModule}>
            <button className="module-toggle-btn" onClick={handleModuleChange}>
              login
            </button>
            <button className="module-toggle-btn" onClick={handleModuleChange}>
              register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
