const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/prodController");
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.post("/", asyncHandler(createProduct));

router.get("/:id", asyncHandler(getaProduct));

router.put("/:id", asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(deleteProduct));

router.get("/", asyncHandler(getAllProduct));



module.exports =  router