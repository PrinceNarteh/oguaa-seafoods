const Product = require("../models/product");
const ErrorResponse = require("../utils/errorResponse");
const { uploadImage, deleteImage } = require("../utils/imageUpload");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  const { name, description, price } = req.body;

  try {
    const product = new Product({ name, description, price });
    const imageUrl = await uploadImage(req, product, next);

    if (imageUrl) {
      product.image = imageUrl;
      await product.save();
      res.status(200).json({ success: true, product });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    if (req.file !== undefined) {
      deleteImage(product.image);
      const imageName = await uploadImage(req, product, next);

      if (imageName) {
        const updatedProduct = await product.updateOne({
          ...req.body,
          image: imageName,
        });
        res.status(200).json({ success: true, product: updatedProduct });
      }
    } else {
      const updatedProduct = await product.updateOne({
        ...req.body,
      });
      res.status(200).json({ success: true, product: updatedProduct });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }
    deleteImage(product.image);
    await Product.findByIdAndRemove(productId);
    res.status(204).json({ success: true, data: "Product deleted." });
  } catch (error) {
    next(error);
  }
};
