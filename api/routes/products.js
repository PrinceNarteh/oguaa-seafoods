const router = require("express").Router();
const productController = require("../controllers/products");
const { upload } = require("../utils/imageUpload");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(upload.single("image"), productController.addProduct);

router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(upload.single('image'), productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
