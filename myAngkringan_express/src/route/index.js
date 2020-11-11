const router = require("express").Router(),
   user = require("./user"),
   restaurant = require("./restaurant"),
   item = require("./item"),
   review = require("./review"),
   category = require("./category"),
   profile = require("./profile"),
   checkout = require("./checkout"),
   cart = require("./cart");

router.use("/user", user);
router.use("/cart", cart);
router.use("/restaurant", restaurant);
// router.use("/item", item);
router.use("/review", review);
router.use("/category", category);
router.use("/profile", profile);
router.use("/checkout", checkout);

module.exports = router