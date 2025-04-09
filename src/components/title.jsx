"use client";

import styles from "./title.module.css";
import React from "react";
import Image from "next/image";

export default function Title() {
  return (
    <div className={styles.content}>
      <div className={styles.slogan}>
        <h1>Bringing Your Designs to Life, </h1><br />
        <h2>
          One Shirt at a <span className={styles.inlineImage}>
            <Image src="/img/T-SHIRT-t.png" alt="Logo T" width={80} height={80} />
          </span>ime!
        </h2>
      </div>
    </div>
  );
}
