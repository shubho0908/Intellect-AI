"use client";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function AlertBar() {
  return (
    <>
      <div
        className={`flex items-center p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 ${poppins.className} shadow-sm`}
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">Warning alert!</span> This model needs
          high processing power to run and may take a long time to load.
        </div>
      </div>
    </>
  );
}

export default AlertBar;
