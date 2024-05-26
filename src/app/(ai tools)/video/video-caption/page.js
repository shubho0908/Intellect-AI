"use client";
import {
  Button,
  Chip,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Progress,
  CardBody,
  Card,
  Select,
  SelectItem,
  ScrollShadow,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import {
  Poppins,
  Atkinson_Hyperlegible,
  M_PLUS_Rounded_1c,
  Tajawal,
} from "next/font/google";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { MdDone } from "react-icons/md";
import { HexColorPicker } from "react-colorful";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});

const poppinsExtraBold = Poppins({
  weight: "800",
  subsets: ["latin"],
});

const poppinsBoldItalic = Poppins({
  weight: "700",
  subsets: ["latin"],
  style: "italic",
});

const poppinsBold = Poppins({
  weight: "700",
  subsets: ["latin"],
});

const atkinsonBold = Atkinson_Hyperlegible({
  weight: "700",
  subsets: ["latin"],
});

const atkinsonBoldItalic = Atkinson_Hyperlegible({
  weight: "700",
  subsets: ["latin"],
  style: "italic",
});

const mPlusRounedExtraBold = M_PLUS_Rounded_1c({
  weight: "800",
  subsets: ["latin"],
});

const tajawalBold = Tajawal({
  weight: "700",
  subsets: ["latin"],
});

const tajawalExtraBold = Tajawal({
  weight: "800",
  subsets: ["latin"],
});

function page() {
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileData, setFileData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadClicked, setUploadClicked] = useState(false);
  const [fontStyle, setFontStyle] = useState(new Set([]));
  const [fontSize, setFontSize] = useState(new Set([]));
  const [color, setColor] = useState("#ffffff");
  const [highlightColor, setHighlightColor] = useState("#000000");
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isHighlightColorOpen, setIsHighlightColorOpen] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [CaptionedVideo, setCaptionedVideo] = useState(null);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const size = file.size / 1024 / 1024;
    if (size > 100) {
      alert("File size should be less than 100MB");
    } else {
      setIsFileSelected(true);
      setFileData(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const size = file.size / 1024 / 1024;
    if (size > 100) {
      alert("File size should be less than 100MB");
    } else {
      setIsFileSelected(true);
      setFileData(file);
    }
  };

  const uploadVideo = async (file) => {
    try {
      if (!file) {
        return null;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const newFile = reader.result;

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
            {
              method: "POST",
              body: JSON.stringify({
                file: newFile,
                upload_preset: "intellect",
                api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                public_id: `videos/videoCaption/${Date.now()}`,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          setUploadedVideo(data.secure_url);
          setUploadClicked(false);
        } catch (error) {
          console.log("Error uploading video:", error.message);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.log("Error converting file to base64:", error.message);
    }
  };

  const generateVideo = async () => {
    try {
      setIsSubmitClicked(true);
      const fontSizeValue = parseInt(fontSize?.currentKey, 10);
      const response = await fetch("/api/videos/video-subtitle", {
        method: "POST",
        body: JSON.stringify({
          video: uploadedVideo,
          font: fontStyle?.currentKey,
          fontSize: fontSizeValue,
          color,
          highlightColor,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, data, error } = await response.json();
      if (success) {
        setCaptionedVideo(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fontSizes = ["2 rem", "4 rem", "6 rem", "7 rem", "8 rem", "10 rem"];

  const download = async (data) => {
    const downloadUrl = data;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "download";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error("Error downloading content:", error);
    }
  };

  return (
    <>
      <div className="video-caption flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4 mb-20">
        <div className="top mt-10 w-[90%] flex items-center justify-between gap-6">
          <div className="left w-1/2">
            <Chip
              color="warning"
              variant="dot"
              className={`${litePoppins2.className} py-4 mt-2 mb-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
            >
              AI VIDEO CAPTION
            </Chip>
            <p className={`${litePoppins.className} text-[3.5rem]`}>
              Transform your videos with accurate AI Captioning.
            </p>
            <p
              className={`${litePoppins2.className} text-lg mt-4 text-gray-300`}
            >
              Elevate videos effortlessly with AI Captioning, ensuring accuracy
              and accessibility for enhanced engagement and comprehension.
            </p>
            <Button
              color="primary"
              onClick={onOpen}
              className={`${litePoppins.className} text-md p-6 mt-6`}
            >
              <FiUploadCloud fontSize={26} className="text-white mr-3" />
              Upload Video
            </Button>
          </div>
          <div className="right">
            <Image
              src="/caption/hero.png"
              className="shadow-lg"
              width={650}
              height={650}
              alt="Hero"
            />
          </div>
        </div>
        <div
          className={`bottom ${litePoppins.className} flex flex-col w-full items-center mt-[10rem]`}
        >
          <p className="text-[2rem]">
            How to use Intellect's AI Video Captioning:
          </p>
          <div className="flex items-center justify-evenly w-full mt-14">
            <Card className="w-[350px] flex flex-col items-center ">
              <CardBody>
                <Image
                  src="/caption/upload.png"
                  className="shadow-lg mb-6"
                  width={300}
                  height={300}
                  alt="Upload"
                />
                <div className="px-4 py-2">
                  <p className="text-semibold text-center text-lg">
                    Upload your video
                  </p>
                  <p
                    className={`${litePoppins2.className}  text-gray-300 mt-2 text-center`}
                  >
                    Upload your video for instant, accurate AI-generated
                    captions.
                  </p>
                </div>
              </CardBody>
            </Card>
            <Card className="w-[350px] flex flex-col items-center ">
              <CardBody>
                <Image
                  src="/caption/style.png"
                  className="shadow-lg"
                  width={350}
                  height={350}
                  alt="Style"
                />
                <div className="px-4 py-2">
                  <p className="text-semibold text-center text-lg">
                    Change subtitle styles
                  </p>
                  <p
                    className={`${litePoppins2.className}  text-gray-300 mt-2 text-center`}
                  >
                    Customize subtitle styles, and explore additional features.
                  </p>
                </div>
              </CardBody>
            </Card>
            <Card className="w-[350px] flex flex-col items-center ">
              <CardBody>
                <Image
                  src="/caption/download.png"
                  className="shadow-lg"
                  width={320}
                  height={320}
                  alt="download"
                />
                <div className="px-4 py-2">
                  <p className="text-semibold text-center text-lg">
                    Download your video
                  </p>
                  <p
                    className={`${litePoppins2.className}  text-gray-300 mt-2 text-center`}
                  >
                    Download your video or export the subtitle file separately.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        <div
          className={`${litePoppins.className} text-[2rem] flex flex-col items-center mt-[7rem]`}
        >
          <p className="text-[2rem]">Example</p>
          <div className="videos-compare mt-8 flex items-center">
            <div className="vid text-sm flex flex-col-reverse">
              <video
                width="550"
                height="550"
                loop
                autoPlay
                controls
                preload="none"
                className="rounded-xl shadow-lg mr-6"
              >
                <source src="/caption/input.mp4" type="video/mp4" />
              </video>
              <p className={`${litePoppins.className} text-lg text-center mb-2`}>ORIGINAL</p>
            </div>
            <div className="vid text-sm flex flex-col-reverse">
              <video
                width="550"
                height="550"
                loop
                autoPlay
                controls
                muted
                preload="none"
                className="rounded-xl shadow-lg"
              >
                <source src="/caption/demo.mp4" type="video/mp4" />
              </video>
              <p className={`${litePoppins.className} text-lg text-center mb-2`}>GENERATED</p>
            </div>
          </div>
        </div>
      </div>
      {/* Modal  */}
      <Modal
        placement="center"
        backdrop="blur"
        size="2xl"
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody
                className={`${litePoppins.className} max-h-[600px] overflow-scroll scrollbar-hide`}
              >
                <ScrollShadow className="max-h-[600px] scrollbar-hide">
                  <div className="py-6 flex flex-col items-center justify-center">
                    {!uploadedVideo && (
                      <div className="left fadein flex flex-col items-center w-full px-6">
                        {!uploadClicked && (
                          <>
                            <div
                              className={`${litePoppins2.className} flex w-full items-center flex-col justify-center`}
                            >
                              <p className={`${litePoppins.className} text-xl`}>
                                Upload a video
                              </p>
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col mt-6 items-center justify-center w-full h-64 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-none"
                              >
                                <div
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={handleFileDrop}
                                  className="flex flex-col items-center justify-center pt-5 pb-6"
                                >
                                  {!isFileSelected && (
                                    <>
                                      <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                      >
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                      </svg>
                                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                    </>
                                  )}

                                  {isFileSelected && !uploadClicked && (
                                    <div className="fadein flex flex-col items-center">
                                      <div className="tick p-2 w-fit rounded-full border-2 border-green-500">
                                        <MdDone
                                          fontSize={30}
                                          className="text-green-500"
                                        />
                                      </div>
                                      <p className="mt-3 text-center">
                                        File selected: {fileData.name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <input
                                  onChange={handleFileChange}
                                  id="dropzone-file"
                                  type="file"
                                  accept="video/mp4"
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <Button
                              color="primary"
                              isDisabled={!isFileSelected}
                              onClick={async () => {
                                setUploadClicked(true);
                                await uploadVideo(fileData);
                              }}
                              className={`${litePoppins.className} w-full mt-6`}
                            >
                              Upload
                            </Button>
                          </>
                        )}
                        {uploadClicked && (
                          <div className="flex fadein flex-col items-center w-full leading-10">
                            <p className={`${litePoppins.className} text-lg`}>
                              Your video is being uploaded...
                            </p>
                            <p
                              className={`${litePoppins2.className} text-gray-400`}
                            >
                              Please wait... this process may take a while.
                            </p>
                            <Progress
                              size="sm"
                              isIndeterminate
                              aria-label="Loading..."
                              className="max-w-md py-4"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {uploadedVideo && !isSubmitClicked && (
                      <>
                        <div className="flex flex-col fadein items-start">
                          <div className="left">
                            <video
                              width="550"
                              height="550"
                              loop
                              autoPlay
                              preload="none"
                              className="rounded-xl shadow-lg"
                            >
                              <source src={uploadedVideo} type="video/mp4" />
                            </video>
                          </div>
                          <div className="right flex items-start justify-between w-full mt-6">
                            <div className="sub-left flex flex-col items-start">
                              <Select
                                className={`${litePoppins2.className} py-2 w-[250px]`}
                                label="Favorite font"
                                placeholder="Select a font style"
                                selectedKeys={fontStyle}
                                onSelectionChange={setFontStyle}
                              >
                                <SelectItem
                                  className={poppinsExtraBold.className}
                                  key="Poppins/Poppins-ExtraBold.ttf"
                                  value={"Poppins/Poppins-ExtraBold.ttf"}
                                >
                                  Poppins Extra Bold
                                </SelectItem>
                                <SelectItem
                                  className={poppinsBold.className}
                                  key="Poppins/Poppins-Bold.ttf"
                                  value={"Poppins/Poppins-Bold.ttf"}
                                >
                                  Poppins Bold
                                </SelectItem>
                                <SelectItem
                                  className={poppinsBoldItalic.className}
                                  key="Poppins/Poppins-BoldItalic.ttf"
                                  value={"Poppins/Poppins-BoldItalic.ttf"}
                                >
                                  Poppins Bold Italic
                                </SelectItem>
                                <SelectItem
                                  className={atkinsonBold.className}
                                  key="Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf"
                                  value={
                                    "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf"
                                  }
                                >
                                  Atkinson Hyperlegible Bold
                                </SelectItem>
                                <SelectItem
                                  className={atkinsonBoldItalic.className}
                                  key="Atkinson_Hyperlegible/AtkinsonHyperlegible-BoldItalic.ttf"
                                  value={
                                    "Atkinson_Hyperlegible/AtkinsonHyperlegible-BoldItalic.ttf"
                                  }
                                >
                                  Atkinson Hyperlegible Bold Italic
                                </SelectItem>
                                <SelectItem
                                  className={mPlusRounedExtraBold.className}
                                  key="M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf"
                                  value={
                                    "M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf"
                                  }
                                >
                                  M PLUS Extra Bold
                                </SelectItem>
                                <SelectItem
                                  className={tajawalBold.className}
                                  key="Tajawal/Tajawal-Bold.ttf"
                                  value={"Tajawal/Tajawal-Bold.ttf"}
                                >
                                  Tajawal Bold
                                </SelectItem>
                                <SelectItem
                                  className={tajawalExtraBold.className}
                                  key="Tajawal/Tajawal-ExtraBold.ttf"
                                  value={"Tajawal/Tajawal-ExtraBold.ttf"}
                                >
                                  Tajawal Extra Bold
                                </SelectItem>
                              </Select>
                              <div className="color flex flex-col items-start mt-4">
                                <p className={litePoppins2.className}>
                                  Select font color
                                </p>
                                <Card className="bg-gray-700/60 mt-3">
                                  <CardBody>
                                    <div className="flex items-center gap-3">
                                      <div
                                        onClick={() =>
                                          setIsColorOpen(!isColorOpen)
                                        }
                                        className="w-10 h-10 rounded-lg cursor-pointer"
                                        style={{ backgroundColor: color }}
                                      ></div>
                                      <p>{color}</p>
                                    </div>
                                  </CardBody>
                                </Card>
                                {isColorOpen && (
                                  <HexColorPicker
                                    className="mt-4"
                                    color={color}
                                    onChange={setColor}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="sub-right">
                              <Select
                                className={`${litePoppins2.className} py-2 w-[250px]`}
                                label="Prefferd font size"
                                placeholder="Select a font size"
                                selectedKeys={fontSize}
                                onSelectionChange={setFontSize}
                              >
                                {fontSizes.map((size, index) => (
                                  <SelectItem
                                    className={litePoppins2.className}
                                    key={size}
                                    value={size}
                                  >
                                    {size}
                                  </SelectItem>
                                ))}
                              </Select>
                              <div className="color flex flex-col items-start mt-4">
                                <p className={litePoppins2.className}>
                                  Select highlight color
                                </p>
                                <Card className="bg-gray-700/60 mt-3">
                                  <CardBody>
                                    <div className="flex items-center gap-3">
                                      <div
                                        onClick={() =>
                                          setIsHighlightColorOpen(
                                            !isHighlightColorOpen
                                          )
                                        }
                                        className="w-10 h-10 rounded-lg cursor-pointer"
                                        style={{
                                          backgroundColor: highlightColor,
                                        }}
                                      ></div>
                                      <p>{highlightColor}</p>
                                    </div>
                                  </CardBody>
                                </Card>
                                {isHighlightColorOpen && (
                                  <HexColorPicker
                                    className="mt-4"
                                    color={highlightColor}
                                    onChange={setHighlightColor}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {isSubmitClicked && !CaptionedVideo && (
                      <div className="loading fadein w-full flex flex-col items-center justify-center">
                        <Spinner
                          label="Please wait! Your captions are being generated..."
                          color="default"
                          labelColor="foreground"
                          className={`${litePoppins.className} text-lg text-center`}
                        />
                      </div>
                    )}
                    {CaptionedVideo && (
                      <>
                        <video
                          width="550"
                          height="550"
                          loop
                          autoPlay
                          controls
                          preload="none"
                          className="rounded-xl shadow-lg"
                        >
                          <source src={CaptionedVideo} type="video/mp4" />
                        </video>
                        <Button
                          className={`${litePoppins.className} mt-4`}
                          onClick={() => download(CaptionedVideo)}
                          color="primary"
                        >
                          Download video
                        </Button>
                      </>
                    )}
                  </div>
                </ScrollShadow>
              </ModalBody>
              {uploadedVideo && !isSubmitClicked && (
                <ModalFooter>
                  <Button
                    variant="ghost"
                    color="default"
                    className={litePoppins.className}
                    radius="full"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={generateVideo}
                    variant="solid"
                    color="primary"
                    className={litePoppins.className}
                    radius="full"
                  >
                    Submit changes
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
