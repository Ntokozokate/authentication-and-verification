import dotenv from "dotenv";
dotenv.config();
import { connectMongoBD } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import express from "express";

const app = express();
const port = process.env.PORT || 3006;

//Main logic endpoints

//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);

connectMongoBD();

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
