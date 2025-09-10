import { Router } from "express";
import {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
} from "../Controllers/itemController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const itemRoutes = Router();

itemRoutes.use(authMiddleware); // Protect all item routes
itemRoutes.post("/", createItem);
itemRoutes.get("/", getAllItems);
itemRoutes.get("/:id", getItem);
itemRoutes.put("/:id", updateItem);
itemRoutes.delete("/:id", deleteItem);

export default itemRoutes;
