const express = require("express");
const { createPost, deletePost, getPostsWithComments, getPostsWithCommentCount } = require("../services/postService");

const router = express.Router();

router.post("/", createPost);
router.delete("/:id", deletePost);
router.get("/with-comments", getPostsWithComments);
router.get("/comment-count", getPostsWithCommentCount);

module.exports = router;
