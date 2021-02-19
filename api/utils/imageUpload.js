const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const ErrorResponse = require("../utils/errorResponse");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, product, next) => {
  if (req.file === undefined) {
    return next(
      new ErrorResponse("Please upload an image for the product.", 400)
    );
  }

  const name = product.name.toLowerCase().split(" ").join("-");
  const ext = req.file.mimetype.split("/")[1];
  const filename = `${name}.${ext}`;
  const dir = "./public/images";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await sharp(req.file.buffer).toFile(`${dir}/${filename}`);
  return filename;
};

const deleteImage = (imageName) => {
  const path = `./public/images/${imageName}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

module.exports = { upload, uploadImage, deleteImage };
