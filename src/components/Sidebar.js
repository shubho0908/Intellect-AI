import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Sidebar() {
  return (
    <>
      <div
        className={`sidebar bg-[#07060B] flex flex-col w-fit h-[100vh] p-6 px-12 ${poppins.className}`}
      >
        <div className="logo-section">
          <Link href="/">
            <Image src="/logo1.png" width={220} height={220} />
          </Link>
        </div>
        <div className="middle-section flex flex-col">
          <Link
            href="/"
            className="hover:bg-[#475FFF] py-3 px-6 rounded-lg transition-all"
          >
            Home
          </Link>
          <Link
            href="/"
            className="hover:bg-[#475FFF] py-3 px-6 rounded-lg transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="hover:bg-[#475FFF] py-3 px-6 rounded-lg transition-all"
          >
            Videos
          </Link>
          <div className="video-tools flex flex-col">
            <Link href="/">Image to Motion</Link>
            <Link href="/">Video Matting</Link>
            <Link href="/">Video Caption Generator</Link>
            <Link href="/">Video Upscaler</Link>
            <Link href="/">Video Re-talking</Link>
          </div>
          <Link
            href="/"
            className="hover:bg-[#475FFF] py-3 px-6 rounded-lg transition-all"
          >
            Images
          </Link>
          <div className="image-tools flex flex-col">
            <Link href="/">Image Generator</Link>
            <Link href="/">Image Upscaler</Link>
            <Link href="/">Professional Headshots</Link>
            <Link href="/">AI Avatar</Link>
            <Link href="/">Generative Fill</Link>
          </div>
          <Link
            href="/"
            className="hover:bg-[#475FFF] py-3 px-6 rounded-lg transition-all"
          >
            Audios
          </Link>
          <div className="image-tools flex flex-col">
            <Link href="/">Audio Enhancer</Link>
            <Link href="/">Subtitle generator</Link>
          </div>
          <Link
            href="/"
            className="hover:bg-[#475FFF] py-3 px-6 rounded-lg transition-all"
          >
            My Collections
          </Link>
        </div>
        <div className="profile"></div>
      </div>
    </>
  );
}

export default Sidebar;
