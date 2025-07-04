"use client";

import styles from "./manual.module.css";
import React from "react";

export default function Manual() {
  const steps = [
    { number: "01", text: "Encuentra el producto que se ajuste a tus necesidades" },
    { number: "02", text: "Selecciona el producto para ir al formulario de cotización" },
    { number: "03", text: "Llena todos los campos del formulario, no olvides subir tu logo en formato PNG" },
    { number: "04", text: "Revisa la vista previa de tu pedido y haz clic en Enviar" },
    { number: "05", text: "Tú terminas, nosotros nos encargamos del resto" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>¿CÓMO HACER UN PEDIDO?</h1>
      </div>
      <div className={styles.right}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.number}>
              <span>{step.number}</span>
              <div className={styles.underline}></div>
            </div>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
