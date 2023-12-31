const Product = require("../models/prodModel");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");

const createProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json({ acknowledged:true, insertedId: newProduct.id });
  } catch (error) {
    throw new Error(error);
  }
};

const updateProduct = async (req, res) => {
    const id = req.params.id; // Corrected
  
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
  
      // Update data, specifying the unique identifier
      const updateProduct = await Product.findOneAndUpdate(
        { _id: id },     // Corrected filter using _id
        req.body,
        { new: true }
      );
  
      if (!updateProduct) {
        return res.status(400).json({ message: "Product not found" });
      }
  
      res.status(204).json(updateProduct)
    } catch (error) {
      throw new Error(error);
    }
  };
  

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  validateMongodbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete({_id: id});
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
};

const getaProduct = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProduct = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
};




module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};