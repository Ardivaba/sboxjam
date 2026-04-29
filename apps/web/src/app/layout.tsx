import type { Metadata } from "next";
import { Nav } from "@/features/nav/Nav";
import { Footer } from "@/features/nav/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "s&box Jam — The Ultimate Game Jam",
  description: "Join the biggest s&box game jam. Build games, form teams, win prizes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Sen:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="hero-bg" />
        <div className="relative z-10">
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
