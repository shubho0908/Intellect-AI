import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Backend Upload
const UploadImage = async (data, id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      data,
      { public_id: `images/${id}/${Date.now()}` },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const UploadVideo = async (data, id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      data,
      { resource_type: "video", public_id: `videos/${id}/${Date.now()}` },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export { UploadImage, UploadVideo };
