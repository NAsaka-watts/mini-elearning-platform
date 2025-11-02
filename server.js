// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("Mini E-Learning API is running.");
});

app.get("/courses", (req, res) => {
  const filePath = path.join(__dirname, "courses.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "courses.json not found" });
  }
  const data = fs.readFileSync(filePath, "utf8");
  const courses = JSON.parse(data);
  res.json(courses);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
