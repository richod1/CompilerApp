import express from "express";
import {
  deleteCode,
  editCode,
  getAllCodes,
  loadCode,
  saveCode,
} from "../controllers/compilerController";
import { verifyTokenAnonymously } from "../middlware/verifyTokenAnonymous";
import { verifyToken } from "../middlware/verifyToken";

export const compilerRouter = express.Router();

compilerRouter.post("/save", verifyTokenAnonymously, saveCode);
compilerRouter.post("/load", verifyTokenAnonymously, loadCode);
compilerRouter.delete("/delete/:id", verifyToken, deleteCode);
compilerRouter.put("/edit/:id", verifyToken, editCode);
compilerRouter.get("/get-all-codes", getAllCodes);