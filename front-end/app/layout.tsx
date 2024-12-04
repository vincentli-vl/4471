import type { Metadata } from "next";
import "./globals.css";
import Header from './components/layout/header'
import { AuthProvider } from './context/AuthContext';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </AuthProvider>
  )
}
