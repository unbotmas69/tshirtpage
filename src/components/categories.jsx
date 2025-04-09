"use client";

import styles from "./categories.module.css";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Categories() {
  const router = useRouter();

  const categories = [
    { src: "/img/t-shirts.jpg", alt: "T-Shirt", link: "/categories/t-shirts" },
    { src: "/img/hoodies.jpg", alt: "Hoodie", link: "/categories/hoodies" },
    { src: "/img/shirt.jpg", alt: "Shirt", link: "/categories/shirt" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Categories</h1>
      </div>
      <div className={styles.content}>
        {categories.map((category, index) => (
          <div key={index} className={styles.category} onClick={() => router.push(category.link)}>
            <div className={styles.imageContainer}>
              <Image src={category.src} alt={category.alt} layout="fill" objectFit="cover" />
            </div>
            <p className={styles.text}>{category.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
