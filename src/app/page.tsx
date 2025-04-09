import { Header, Title, Carrusel, Categories, Manual, ContactForm, Footer } from "@/components";

export default function Home() {
  return (
    <div>
      <main className="overflow-hidden">
        <Header />
        <Title />
        <Carrusel />
        <Categories />
        <Manual />
        <ContactForm />
        <Footer />
      </main>
    </div>
  );
}
