
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name cannot be empty."],
    },
    description: {
      type: String,
      required: [true, "Product description cannot be empty."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
    },
    image: {
      type: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual('url').get(function () {
  return `http://localhost:4000/images/${this.image}`
})

module.exports = mongoose.model("Product", productSchema);