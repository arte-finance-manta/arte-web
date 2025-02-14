import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/providers";
import { Poppins } from "next/font/google";
import DefaultLayout from "@/components/layouts/default";

const inter = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Arte Finance",
  description: "Lending and borrowing.",
  icons: {
    icon: "/logo_white.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Toaster
            toastOptions={{
              duration: 3000,
            }}
          />
          <DefaultLayout>
            {children}
          </DefaultLayout>
        </Providers>
      </body>
    </html>
  );
}
