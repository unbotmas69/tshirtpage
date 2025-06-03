"use client";

import styles from "./header.module.css";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi"; // Asegúrate de tener react-icons instalado

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/img/T-SHIRT-FullColor.png" alt="Logo" width={150} height={150} />
        </Link>
      </div>

      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </div>

      <nav className={`${styles.buttons} ${menuOpen ? styles.active : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <button className={styles.button}>Home</button>
        </Link>
        <Link href="#t-shirts" onClick={() => setMenuOpen(false)}>
          <button className={styles.button}>T-Shirts</button>
        </Link>
        <Link href="#contact" onClick={() => setMenuOpen(false)}>
          <button className={styles.button}>Contact</button>
        </Link>
      </nav>
    </header>
  );
}
