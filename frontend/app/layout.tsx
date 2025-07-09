import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuneSync - Smart Playlist Converter",
  description:
    "Transfer and sync your music playlists across Spotify, Apple Music, YouTube Music, and more. Free playlist transfer tool with secure, instant syncing.",
  keywords: [
    "playlist",
    "music",
    "spotify",
    "youtube",
    "apple music",
    "deezer",
    "sync",
    "converter",
    "playlist transfer",
    "playlist sync",
    "music sync",
    "music transfer",
    "music migration",
    "music converter",
    "cross-platform music",
    "streaming platform sync",
    "music library sync",
    "music library transfer",
    "music library migration",
    "music library converter",
  ],
  authors: [{ name: "TuneSync Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
