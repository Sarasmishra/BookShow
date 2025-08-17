// middlewares/cloudinaryUpload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // folder in cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;
