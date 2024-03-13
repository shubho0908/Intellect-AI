function CustomLoading() {
  return (
    <>
      <div className="loading">
        <div className="image-gen flex items-start justify-between">
          <div className="left p-6 relative mt-0 ml-0 sm:ml-[120px] md:ml-[320px] border-r-0 xl2:border-r-2 xl2:border-gray-800">
            <div className="top ">
              <h1 className={`${poppins.className} text-2xl`}>
                Generate Image
              </h1>
              <div className="generated-image flex-wrap newXL:flex-nowrap py-6 flex items-start">
                <div className="left border-2 border-gray-800 p-4 rounded-lg">
                  <Menu />

                  <Image
                    isZoomed
                    src="https://replicate.delivery/pbxt/JipAbQ9UAnZaAR1dlnf4aYDoOONnCgBtUATVoLUZtsecaRbSA/out-0.png"
                    alt="image"
                    width={500}
                    height={500}
                    className="cursor-pointer z-[1]"
                  />
                </div>
                <div
                  className={`${litePoppins.className} right  py-4 w-[100%] newXL:w-3/4 newXL:px-8 newXL:py-0`}
                >
                  <div className="prompt">
                    <p className="text-gray-400">Prompt</p>
                    <p className="mt-2">
                      A dolphin leaps through the waves, set against a backdrop
                      of bright blues
                    </p>
                  </div>
                  <div className="buttons flex flex-wrap gap-4 items-end py-6">
                    <Button
                      color="primary"
                      variant="solid"
                      className="rounded-lg"
                    >
                      <RxUpload
                        fontSize={21}
                        className="text-white xsm:block hidden"
                      />
                      Publish
                    </Button>
                    <Button
                      color="danger"
                      variant="solid"
                      className="rounded-lg bg-red-600"
                    >
                      <MdDeleteOutline fontSize={22} className="text-white" />
                      Delete
                    </Button>
                  </div>
                  <div className="more-details">
                    <div className="model">
                      <p className="text-gray-400">Model</p>
                      <div className="model-name flex items-center">
                        <PiMagicWand
                          fontSize={22}
                          className="text-white mr-2"
                        />
                        <p>Stable Diffusion XL</p>
                      </div>
                    </div>
                    <div className="dimension mt-4">
                      <p className="text-gray-400">Resolution</p>
                      <p>1024 x 1024px</p>
                    </div>
                    <div className="created mt-4">
                      <p className="text-gray-400">Created At</p>
                      <p>Jan 1, 2022</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom mt-4">
              <RelatedImages />
            </div>
          </div>
          <div
            className={`${litePoppins.className}  hidden xl2:block right h-[100vh] p-6 w-[450px]`}
          >
            <Playground />
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomLoading;
