"use client";

import styles from "./footer.module.css";
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className={styles.content}>
      <div className={styles.footerContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <Image src="/img/T-SHIRT-Black.png" alt="Logo" width={150} height={50} />
        </div>
        {/* Horarios de Atención */}
        <div className={styles.hours}>
          <h4>Horarios de atencion</h4>
          <p>Lun - Vie: 9:00 AM - 6:00 PM</p>
          <p>Sab: 10:00 AM - 4:00 PM</p>
          <p>Dom: Cerrado</p>
        </div>

        {/* Medios de Contacto */}
        <div className={styles.contact}>
          <h4>Contacto</h4>
          <p>Email: contact@example.com</p>
          <p>Phone: +123 456 7890</p>
        </div>

        {/* Redes Sociales */}
        <div className={styles.social}>
          <h4>Siguenos</h4>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Image src="/img/icons/face.png" alt="Facebook" width={30} height={30} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src="/img/icons/insta.png" alt="Instagram" width={30} height={30} />
            </a>
          </div>
        </div>
      </div>

      {/* Información de la Página - Link a la web */}
      <div className={styles.createdBy}>
        <p>
          Sistema hecho por {" "}
          <a href="https://www.maypretec.com" target="_blank" rel="noopener noreferrer">
            Maypretec
          </a>
        </p>
      </div>
    </div>
  );
}
