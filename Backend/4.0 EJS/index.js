import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const d = new Date("2026-09-13T23:15:30");
  const day = d.getDay();
  const dayType =
    day === 0 || day === 6
      ? "Hey! It's a weekend, it's time to play hard!"
      : "Hey! It's a weekday, it's time to work hard!";

  res.render("index.ejs", { dayType });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});