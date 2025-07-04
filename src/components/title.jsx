"use client";

import styles from "./title.module.css";
import React from "react";
import Image from "next/image";

export default function Title() {
  return (
    <div className={styles.content}>
      <div className={styles.slogan}>
        <h1>Dando vida a tus diseños, </h1><br />
        <h2>
          Una camiseta a la vez!
        </h2>
      </div>
    </div>
  );
}
