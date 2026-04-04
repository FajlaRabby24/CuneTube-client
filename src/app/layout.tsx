import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "CineTube",
  description: "A movie streaming platform",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
