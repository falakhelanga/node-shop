const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: "",
    oldInputs: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req).array();

  try {
    if (errors.length !== 0) {
      return res.render("admin/edit-product", {
        path: "admin/add-product",
        pageTitle: "Add Product",
        editing: false,
        hasError: true,
        errorMessage: errors[0].msg,
        oldInputs: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description,
        },
      });
    }

    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user,
    });

    await product.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

  // // product
  // //   .save()
  // //   .then(result => {
  // //     // console.log(result);
  // //     console.log('Created Product');
  // //     res.redirect('/admin/products');
  // //   })
  // //   .catch(err => {
  // //     console.log(err);
  // //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: "",
        oldInputs: {
          title: "",
          imageUrl: "",
          price: "",
          description: "",
        },
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
    const product = await Product.findById(prodId);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;

    const errors = validationResult(req).array();

    if (errors.length !== 0) {
      return res.render("admin/edit-product", {
        path: "admin/add-product",
        pageTitle: "Add Product",
        editing: false,
        hasError: true,
        errorMessage: errors[0].msg,
        oldInputs: {
          title: updatedTitle,
          imageUrl: updatedImageUrl,
          price: updatedPrice,
          description: updatedDesc,
        },
      });
    }

    await product.save();
    res.redirect("/admin/products");
    // return product.save().then((result) => {
    //   console.log("UPDATED PRODUCT!");
    //   res.redirect("/admin/products");
    // });
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
