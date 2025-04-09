// src/app/order-form/layout.tsx
import { ReactNode } from "react";
import { Header, Footer } from "@/components";

export default function OrderFormLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
