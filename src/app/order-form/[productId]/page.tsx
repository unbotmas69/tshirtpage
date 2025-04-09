"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header, Footer } from "@/components";
import styles from "./page.module.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

const productData: Product[] = [
  { id: "0001", name: "T-Shirt Basic", description: "A simple, comfortable T-shirt", price: "$20" },
  { id: "0002", name: "Premium T-Shirt", description: "High quality, breathable fabric", price: "$40" },
  { id: "0003", name: "Graphic T-Shirt", description: "Stylish T-shirt with graphic design", price: "$30" },
  { id: "0004", name: "Custom T-Shirt", description: "T-shirt with customizable design", price: "$25" },
  { id: "0005", name: "V-neck T-Shirt", description: "Soft and comfortable V-neck", price: "$22" },
  { id: "0006", name: "Round-neck T-Shirt", description: "Basic round-neck T-shirt", price: "$18" },
];

export default function OrderForms() {
  const params = useParams();
  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      const foundProduct = productData.find((product) => product.id === productId);
      setProduct(foundProduct || null);
    }
  }, [productId]);

  return (
    <div>
      <Header />
      <main className={styles.orderFormMain}>
        {product ? (
          <div className={styles.productContainer}>
            <h1 className={styles.productTitle}>Order Form for {product.name}</h1>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productPrice}>Price: <strong>{product.price}</strong></p>
          </div>
        ) : (
          <p className={styles.loadingMessage}>Loading product details...</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
