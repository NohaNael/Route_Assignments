import { userModel } from "./db/models/user.model.js";
import {noteModel} from "./db/models/notes.model.js";
import express from "express";
import { userrouter, productrouter } from "./modules.index.js";
import {productrouter} from "../modules/index.js";
import { connect } from "mongoose";
import { connectDB } from "./db/connection.js";
export const bootstrap = async (app,express) => {
  app.use(express.json());
  await connectDB();
  app.use("/api/v1/users", userrouter);
  app.use("/api/v1/products", productrouter);

  const user = new userModel({
    firstname: "John",
    email: "john@example.com",
    password: "password123",
    age: 25,
    gender: "Male"
  });
  await user.save();


  app.all("/*dummy", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });   
}