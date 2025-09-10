import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from "./Routes/authRoutes.js";
import itemRoutes from "./Routes/itemRoutes.js";
import { connectDB } from "./Config/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:5173/*'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//     allowedHeaders: ['Content-Type', 'Authorization'], 
// }))
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,  // ✅ Required for cookies to work in HTTP-only auth
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
