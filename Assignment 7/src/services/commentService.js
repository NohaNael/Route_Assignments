const { Op } = require("sequelize");
const { Comment, Post } = require("../models");
const { NotFoundError, AppError } = require("../errors/AppError");

function handleError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
}

// POST /api/comments/bulk
async function bulkCreateComments(req, res) {
  try {
    const comments = await Comment.bulkCreate(req.body.comments, {
      validate: true,
    });
    return res.status(201).json(comments);
  } catch (error) {
    return handleError(res, error);
  }
}

// PUT /api/comments/:id
async function updateCommentContent(req, res) {
  try {
    const { userId, content } = req.body;
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) throw new NotFoundError("Comment not found");
    if (comment.userId !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden: you are not the owner of this comment." });
    }
    comment.content = content;
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/comments/find-or-create
async function findOrCreateComment(req, res) {
  try {
    const { userId, postId, content } = req.body;
    const [comment, created] = await Comment.findOrCreate({
      where: { userId, postId, content },
      defaults: { userId, postId, content },
    });
    return res.status(created ? 201 : 200).json(comment);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/comments/search?word=:word
async function searchCommentsByWord(req, res) {
  try {
    const { word } = req.query;
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        content: { [Op.like]: `%${word}%` },
      },
    });
    return res.status(200).json({ count, comments: rows });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/comments/post/:postId/recent
async function getRecentCommentsByPost(req, res) {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAT", "DESC"]],
      limit: 3,
    });
    return res.status(200).json(comments);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/comments/:id
async function getCommentByPk(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [{ model: Post, attributes: ["ID", "title", "content", "userId"] }],
    });
    if (!comment) throw new NotFoundError("Comment not found");
    return res.status(200).json(comment);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  bulkCreateComments,
  updateCommentContent,
  findOrCreateComment,
  searchCommentsByWord,
  getRecentCommentsByPost,
  getCommentByPk,
};
