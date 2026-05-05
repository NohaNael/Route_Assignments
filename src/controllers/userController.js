const express = require("express");
const { createUser, getUserByEmail, getUserById, upsertUser } = require("../services/userService");

const router = express.Router();

router.post("/", createUser);
router.get("/email/:email", getUserByEmail);
router.get("/:id", getUserById);
router.put("/:id/upsert", upsertUser);

module.exports = router;
