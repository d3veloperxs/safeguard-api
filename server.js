const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./licenses.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

function generateKey() {
  return "SG-" + Math.floor(10000000 + Math.random() * 90000000);
}

// Koop license
app.post("/buy", (req, res) => {
  const licenses = JSON.parse(fs.readFileSync(FILE));
  const key = generateKey();

  licenses.push(key);
  fs.writeFileSync(FILE, JSON.stringify(licenses, null, 2));

  res.json({ key });
});

// Check license
app.get("/check", (req, res) => {
  const key = req.query.key;
  const licenses = JSON.parse(fs.readFileSync(FILE));

  res.json({ valid: licenses.includes(key) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running"));
