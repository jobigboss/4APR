import Image from "next/image";
import Container from "./conponents/Container";
import MenuPage from "./conponents/Menu";


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-100 p-4">
    <Container>
      <div className="w-full max-w-[800px] h-auto max-h-[400px] shadow-xl p-5 sm:p-10 mt-5 rounded-xl bg-white">
        <h1 className="text-center text-2xl font-bold mb-5">MENU</h1>
        <MenuPage />
      </div>
    </Container>
  </main>

  );
}
