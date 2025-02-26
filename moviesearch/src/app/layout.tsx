import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Moviesearch",
  description: "A moviesearch app",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <NavBar></NavBar>
        </nav>
        <main>
        {children}
        </main>
      </body>
    </html>
  );
}
