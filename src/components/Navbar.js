import { Input, Avatar } from "@nextui-org/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function Navbar() {
  return (
    <>
      <div
        className={`navbar flex items-center justify-between p-6 ${poppins.className}`}
      >
        <div className="left relative left-[120px] md:left-[320px]">
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <Input
              type="text"
              placeholder="Search for any model."
              className="w-[30rem]"
            />
          </div>
        </div>
        <div className="right pr-6 flex items-center">
          <p> Hi, Shubho!</p>
          <Avatar
            isBordered
            color="primary"
            className="relative left-6 cursor-pointer"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </div>
      </div>
    </>
  );
}

export default Navbar;
