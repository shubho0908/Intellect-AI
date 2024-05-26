import AlertBar from "@/components/AlertBar";

function layout({ children }) {
  return (
    <>
      <div className="sm:ml-[120px] md:ml-[300px] mr-0">
        <AlertBar />
      </div>
      {children}
    </>
  );
}

export default layout;
