import dotenv from "dotenv";
dotenv.config();
import { connectMongoBD } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import imageRoutes from "./routes/image.routes.js";

import express from "express";

const app = express();
const port = process.env.PORT || 3006;

//middleware
app.use(express.json());

//Main logic endpoints
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);
//app.use("/api/fetch", getImageRoutes)

connectMongoBD();

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
