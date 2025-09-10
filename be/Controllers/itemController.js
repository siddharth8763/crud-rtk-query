import Item from "../models/Item.js";

// Create a new item
export async function createItem(req, res) {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }

    // Check if req.user and req.user._id are present (from authMiddleware)
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No authenticated user found" });
    }

    // Create and save the item
    const item = new Item({ name, description, user: req.user._id });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    console.error("Error in createItem:", error);
    res.status(500).json({ message: "Server error while creating item" });
  }
}

// Get all items for the logged-in user
export async function getAllItems(req, res) {
  try {
    const items = await Item.find({ user: req.user._id });
    res.json(items);
  } catch (error) {
    console.error("Error in getAllItems:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
}

// Get a single item by ID for the logged-in user
export async function getItem(req, res) {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error in getItem:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: "Server error while fetching item" });
  }
}

// Update an item by ID
export async function updateItem(req, res) {
  try {
    const { name, description } = req.body;
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }
    if (name) item.name = name;
    if (description) item.description = description;
    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Error in updateItem:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: "Server error while updating item" });
  }
}

// Delete an item by ID
export async function deleteItem(req, res) {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }
    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error in deleteItem:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    res.status(500).json({ message: "Server error while deleting item" });
  }
}
