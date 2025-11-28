import dotenv from "dotenv";
dotenv.config();
import { connectMongoBD } from "./utils/db.js";
import authRoutes from "./routes/auth.rotes.js";
import express from "express";
const app = express();
const port = process.env.PORT || 3006;

//Main logic endpoints

//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

connectMongoBD();

app.listen(port, () => {
  console.log(`Sever listening on port: ${port}`);
});
