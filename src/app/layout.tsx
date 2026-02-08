import type { Metadata } from "next";
import "./tailwind.out.css";

export const metadata: Metadata = {
  title: "Dashboard Accidentes Laborales",
  description: "Sistema de análisis y pronóstico de accidentes laborales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
