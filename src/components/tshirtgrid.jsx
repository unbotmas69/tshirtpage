"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./tshirtgrid.module.css";
import ProductsService from "../api/products";

export default function TShirtGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductsService.Products()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  return (
    <div className={styles.gridContainer}>
      {products.map((shirt, i) => (
        <Link key={i} href={`/order-form/${shirt.productId}`} className={styles.card}>
          <Image
            src={shirt.previewImage}
            alt={`T-shirt model ${shirt.id}`}
            width={200}
            height={200}
            className={styles.image}
          />
          <p>Personaliza este modelo</p>
        </Link>
      ))}
    </div>
  );
}