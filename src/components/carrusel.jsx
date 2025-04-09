"use client";

import styles from "./carrusel.module.css";
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link"; // Importa Link

export default function Carrusel() {
  const images = [
    { src: "/img/shirts/tshirtBlackF.png", alt: "Producto 1", link: "/order-form/0001" },
    { src: "/img/shirts/tshirtBlueF.png", alt: "Producto 2", link: "/order-form/0002" },
    { src: "/img/shirts/tshirtBrownF.png", alt: "Producto 3", link: "/order-form/0003" },
    { src: "/img/shirts/tshirtRedF.png", alt: "Producto 4", link: "/order-form/0004" },
    { src: "/img/shirts/tshirtWhiteF.png", alt: "Producto 5", link: "/order-form/0005" },
    { src: "/img/shirts/tshirtYellowF.png", alt: "Producto 6", link: "/order-form/0006" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h1>Short-sleeved T-shirts</h1>
      </div>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className={styles.slide}>
            <Link href={image.link}> 
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={300}
                className={styles.image}
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
