import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./courses.json";

function readCourses() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeCourses(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/courses", (req, res) => {
  const data = readCourses();
  res.json(data);
});

app.get("/courses/:id", (req, res) => {
  const data = readCourses();
  const course = data.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

app.post("/courses/:id/complete", (req, res) => {
  const data = readCourses();
  const index = data.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  data[index].completed = true;
  writeCourses(data);
  res.json(data[index]);
});

app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));
