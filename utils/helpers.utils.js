import fs from "node:fs";

import { v2 as cloudinary } from "cloudinary";
// helper function to upload file to cloudinary
export const uploadFileToCloudinary = async (imagePath, folder) => {
  const options = { folder };
  return await cloudinary.uploader.upload(imagePath, options);
};

// take type of file and array of supportedtypes, and return true or false, if supported (filetype is included in supportedTypes array) than true otherwise false
export const isFileTypeSupported = (type, supportedTypes) => {
  return supportedTypes.includes(type);
};

export const uploadPdfToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "raw", // ✅ very important
    });

    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw error;
  }
};
