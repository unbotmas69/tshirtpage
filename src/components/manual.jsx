"use client";

import styles from "./manual.module.css";
import React from "react";

export default function Manual() {
  const steps = [
    { number: "01", text: "Find the product that suits your needs" },
    { number: "02", text: "Select the product that will take you to the quote form" },
    { number: "03", text: "Fill in all the fields of the form, don't forget to upload your logo in PNG format" },
    { number: "04", text: "Check the preview of your order, and click on Submit" },
    { number: "05", text: "You finish, we take care of the rest" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>HOW TO PLACE AN ORDER?</h1>
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
