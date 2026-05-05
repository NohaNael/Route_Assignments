const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.createUser);                // POST /api/users
router.get("/email/:email", userController.getUserByEmail); // GET  /api/users/email/:email
router.get("/:id", userController.getUserById);             // GET  /api/users/:id
router.put("/:id/upsert", userController.upsertUser);       // PUT  /api/users/:id/upsert

module.exports = router;
