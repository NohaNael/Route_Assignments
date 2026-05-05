const express = require("express");
const apiRoutes = require("./routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", apiRoutes);

module.exports = app;
