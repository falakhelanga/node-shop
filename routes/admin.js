const path = require("path");
const { body } = require("express-validator");
const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get(
  "/add-product",

  isAuth,
  adminController.getAddProduct
);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .isLength({ min: 4 })
      .withMessage("Your Title Must Have At Least 4 charcters")

      .withMessage("your title must be alphanumeric")
      .notEmpty()
      .trim(),
    body("imageUrl", "please enter the valid URL").isURL().notEmpty().trim(),
    body("price", "your price must be decimal")
      .isFloat()
      .isNumeric()
      .notEmpty()
      .trim(),
    body(
      "description",
      "your description must contain between 8 to 100 charectres"
    ).isLength({ min: 8, max: 100 }),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title")
      .isLength({ min: 4 })
      .withMessage("Your Title Must Have At Least 4 charcters")

      .withMessage("your title must be alphanumeric")
      .notEmpty()
      .trim(),
    body("imageUrl", "please enter the valid URL").isURL().notEmpty().trim(),
    body("price", "your price must be decimal")
      .isFloat()
      .isNumeric()
      .notEmpty()
      .trim(),
    body(
      "description",
      "your description must contain between 8 to 100 charectres"
    ).isLength({ min: 8, max: 100 }),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
