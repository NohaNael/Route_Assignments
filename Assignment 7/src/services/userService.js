const { User } = require("../models");
const { ValidationError, UniqueConstraintError } = require("sequelize");
const { NotFoundError, ConflictError, ValidationAppError, AppError } = require("../errors/AppError");

function mapSequelizeError(error) {
  if (error instanceof UniqueConstraintError) {
    throw new ConflictError("Email already in use.");
  }
  if (error instanceof ValidationError) {
    throw new ValidationAppError(error.errors.map((e) => e.message));
  }
  throw error;
}

function handleError(res, error) {
  if (error instanceof ValidationAppError) {
    return res.status(422).json({ message: error.message, errors: error.errors });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
}

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new ConflictError("Email already in use.");
    const user = User.build({ name, email, password, role });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    mapSequelizeError(error);
    return handleError(res, error);
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["ID", "name", "email", "role", "createdAT", "updatedAt"],
    });
    if (!user) throw new NotFoundError("User not found");
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

async function getUserByEmail(req, res) {
  try {
    const user = await User.findOne({
      where: { email: req.params.email },
      attributes: ["ID", "name", "email", "role", "createdAT", "updatedAt"],
    });
    if (!user) throw new NotFoundError("User not found");
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

async function upsertUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const [user, created] = await User.upsert(
      { ID: req.params.id, name, email, password, role },
      { validate: false }
    );
    return res.status(created ? 201 : 200).json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  upsertUser,
};
