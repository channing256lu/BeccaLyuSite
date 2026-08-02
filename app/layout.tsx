import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ScrollVideo } from "./components/ScrollVideo";
import { getSiteContent } from "./content/getSiteContent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const cormorantDisplay = Cormorant_Garamond({
  variable: "--font-cormorant-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const content = getSiteContent();

  return {
    metadataBase: new URL("https://beccalyu.com"),
    title: content.metadata.title,
    description: content.metadata.description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.ogDescription,
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1734,
          height: 907,
          alt: content.metadata.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metadata.title,
      description: content.metadata.ogDescription,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = getSiteContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.metadata.personName,
    jobTitle: content.metadata.jobTitle,
    description: content.metadata.description,
    knowsAbout: content.metadata.knowsAbout,
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${cormorantDisplay.variable} antialiased`}
      >
        <ScrollVideo />
        <Navbar content={content.nav} />
        {children}
        <Footer content={content.footer} />
      </body>
    </html>
  );
}
