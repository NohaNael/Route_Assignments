const sequelize = require("../config/database");
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

User.hasMany(Post, { foreignKey: "userId", sourceKey: "ID" });
Post.belongsTo(User, { foreignKey: "userId", targetKey: "ID" });

User.hasMany(Comment, { foreignKey: "userId", sourceKey: "ID" });
Comment.belongsTo(User, { foreignKey: "userId", targetKey: "ID" });

Post.hasMany(Comment, { foreignKey: "postId", sourceKey: "ID" });
Comment.belongsTo(Post, { foreignKey: "postId", targetKey: "ID" });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
};
