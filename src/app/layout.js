import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Intellect AI",
  description: "A content creation buddy for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark ">
      <body className="bg-[#120f0f]">
        <Providers>
          <div className="main-div flex w-full">
            <div className="left">
              <Sidebar />
            </div>
            <div className="right w-full">
              <div className="right-content">
                <div className="top bg-[#120f0f] z-[4] fixed w-full">
                  <Navbar />
                </div>
                <div className="bottom w-full">
                  <div className="data relative top-[90px] w-full">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
