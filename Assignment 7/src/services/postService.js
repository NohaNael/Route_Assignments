const { Post, User, Comment } = require("../models");
const sequelize = require("../config/database");
const { NotFoundError, AppError } = require("../errors/AppError");

function handleError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
}

// POST /api/posts
async function createPost(req, res) {
  try {
    const { title, content, userId } = req.body;
    const post = new Post({ title, content, userId });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /api/posts/:id
async function deletePost(req, res) {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) throw new NotFoundError("Post not found");

    const { userId } = req.body;
    if (post.userId !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden: you are not the owner of this post." });
    }

    await post.destroy();
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/posts/with-comments
async function getPostsWithComments(req, res) {
  try {
    const posts = await Post.findAll({
      attributes: ["ID", "title"],
      include: [
        {
          model: User,
          attributes: ["ID", "name"],
        },
        {
          model: Comment,
          attributes: ["ID", "content"],
        },
      ],
    });
    return res.status(200).json(posts);
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/posts/comment-count
async function getPostsWithCommentCount(req, res) {
  try {
    const posts = await Post.findAll({
      attributes: [
        "ID",
        "title",
        [sequelize.fn("COUNT", sequelize.col("Comments.ID")), "commentCount"],
      ],
      include: [
        {
          model: Comment,
          attributes: [],
        },
      ],
      group: ["Post.ID"],
    });
    return res.status(200).json(posts);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createPost,
  deletePost,
  getPostsWithComments,
  getPostsWithCommentCount,
};
