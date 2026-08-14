const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { IMAGE_MIME_TYPES } = require("../config/constants");
const ApiError = require("../utils/ApiError");

const makeStorage = (subfolder) => {
  const dir = path.join(__dirname, "..", "uploads", subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });
};

const fileFilter = (req, file, cb) => {
  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only PNG and JPG images are allowed."));
  }
  cb(null, true);
};

const maxSizeBytes = () => (Number(process.env.MAX_IMAGE_SIZE_MB) || 5) * 1024 * 1024;

// Factory: creates a configured multer instance for a given upload folder (products/customers/reviews)
const createUploader = (subfolder) =>
  multer({
    storage: makeStorage(subfolder),
    fileFilter,
    limits: { fileSize: maxSizeBytes() },
  });

module.exports = { createUploader };
