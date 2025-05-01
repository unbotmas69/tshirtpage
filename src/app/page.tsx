import { Header, Title, Carrusel, Categories, Manual, ContactForm, Footer, TShirtGrid } from "@/components";

export default function Home() {
  return (
    <div>
      <main className="overflow-hidden">
        <Header />
        <Title />
        <Manual />
        <TShirtGrid />
        <ContactForm />
        <Footer />
      </main>
    </div>
  );
}
