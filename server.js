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
app.get("/debug", (req, res) => {
  try {
    const routes = [];

    // iterate over the internal router stack safely
    app._router.stack.forEach(layer => {
      if (layer.route && layer.route.path) {
        routes.push(layer.route.path);
      } else if (layer.name === 'router' && layer.handle && Array.isArray(layer.handle.stack)) {
        layer.handle.stack.forEach(inner => {
          if (inner.route && inner.route.path) {
            routes.push(inner.route.path);
          }
        });
      }
    });

    res.json({ routes });
  } catch (err) {
    console.error("Debug route error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
