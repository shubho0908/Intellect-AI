import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Intellect AI",
  description: "A content creation buddy for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Sidebar />
          <div className="relative left-[360px] w-fit">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
