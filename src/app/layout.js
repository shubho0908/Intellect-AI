import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
// import Sidebar2 from "@/components/Sidebar2";


export const metadata = {
  title: "Intellect AI",
  description: "A content creation buddy for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark  bg-[#120f0f]">
      <body>
        <Providers>
          <div className="fixed-div fixed top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_90%90%_at_50%-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <div className="main-div flex w-full">
            <div className="left">
              <div className="web-sidebar hidden sm:block">
                <Sidebar />
              </div>
              {/* <div className="mob-sidebar block sm:hidden">
                <Sidebar2 />
              </div> */}
            </div>
            <div className="right w-full">
              <div className="right-content">
                {/* <div className="top bg-[#120f0f70] backdrop-blur-xl z-[20] fixed top-0 w-full">
                  <Navbar />
                </div> */}
                <div className="bottom w-full">
                  <div className="data relative w-full">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </Providers>
      </body>
    </html>
  );
}
