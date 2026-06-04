import connectDB from "../db/connection.js";
import { userRouter, noteRouter } from "../modules/index.js";
import { getLoggedInUserData } from "../modules/user/user.service.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());
  await connectDB();

  app.use("/api/v1/users", userRouter);
  app.use("/users", userRouter);
  app.get("/use", getLoggedInUserData);
  app.use("/api/v1/notes", noteRouter);
  app.use("/notes", noteRouter);
  app.use("/note", noteRouter);

  app.all("/*dummy", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
};