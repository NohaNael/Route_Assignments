const express = require("express");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.use("/users", userController);
router.use("/posts", postController);
router.use("/comments", commentController);

module.exports = router;
