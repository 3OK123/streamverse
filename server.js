import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/streaming");

// ================== 2- USERS ==================
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "admin" }
});

const User = mongoose.model("User", UserSchema);

// ================== 3- SERIES ==================
const SeriesSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: String,
  year: Number,
  poster: String,
  episodes: [
    {
      number: Number,
      title: String,
      video: String
    }
  ]
});

const Series = mongoose.model("Series", SeriesSchema);

// ================== 4- AUTH ==================
app.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    username: req.body.username,
    password: hash
  });
  res.json(user);
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("User not found");

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: user._id }, "SECRET");
  res.json({ token });
});

// ================== 5- UPLOAD ==================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else cb(new Error("Only mp4/images"));
  }
});

// ================== 6- SERIES APIs ==================
app.post("/series", async (req, res) => {
  res.json(await Series.create(req.body));
});

app.get("/series", async (req, res) => {
  res.json(await Series.find());
});

// ================== 7- ADD EPISODE ==================
app.post("/episode/:id", upload.single("video"), async (req, res) => {
  const s = await Series.findById(req.params.id);

  s.episodes.push({
    number: req.body.number,
    title: req.body.title,
    video: req.file.filename
  });

  await s.save();
  res.json(s);
});

// ================== 8- START ==================
app.listen(5000, () => console.log("Server running"));
