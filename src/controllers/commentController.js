const express = require("express");
const {
  bulkCreateComments,
  updateCommentContent,
  findOrCreateComment,
  searchCommentsByWord,
  getRecentCommentsByPost,
  getCommentByPk,
} = require("../services/commentService");

const router = express.Router();

router.post("/bulk", bulkCreateComments);
router.put("/:id", updateCommentContent);
router.post("/find-or-create", findOrCreateComment);
router.get("/search", searchCommentsByWord);
router.get("/post/:postId/recent", getRecentCommentsByPost);
router.get("/:id", getCommentByPk);

module.exports = router;
