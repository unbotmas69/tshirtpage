'use client';

import { useEffect, useState } from 'react';
import Editor from './Editor/Editor';
import { Header } from '@/components';
import styles from "./customize.module.css";
import Link from 'next/link';
import Image from 'next/image';


export default function Home() {
  const [content, setContent] = useState<string>('');

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logo}>
        <Link href="/"><Image src="/img/T-SHIRT-GRAY.png" alt="Logo" width={150} height={150} /></Link>
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

      <div className="container">
        <div className="row">
          <div className="col-12">
            <Editor />
          </div>
        </div>
      </div>
      {/* Puedes usar "content" si necesitas mostrarlo */}
      
    </div>
  );
}
