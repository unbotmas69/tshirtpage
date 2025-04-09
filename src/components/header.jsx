"use client";

import styles from "./header.module.css";
import React from "react";
import Image from "next/image";
import Link from "next/link";  // Importa el componente Link

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
      <Link href="/"><Image src="/img/T-SHIRT-FullColor.png" alt="Logo" width={150} height={150} /></Link>
      </div>
      <div className={styles.buttons}>
        <Link href="/">
          <button className={styles.button}>Home</button>
        </Link>
        <Link href="#t-shirts">
          <button className={styles.button}>T-Shirts</button>
        </Link>
        <Link href="#contact">
          <button className={styles.button}>Contact</button>
        </Link>
      </div>
    </header>
  );
}
