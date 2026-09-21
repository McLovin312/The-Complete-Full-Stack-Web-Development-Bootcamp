import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "password",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getItems() {
  try {
    const result = await db.query("SELECT * FROM items");
    return result.rows;
  } catch (err) {
    console.log("Error executing query:", err.stack);
    return [];
  }
}

app.get("/", async (req, res) => {
  const listItems = await getItems();

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: listItems,
  });
});

app.post("/add", async (req, res) => {
  await db.query("INSERT INTO items (title) VALUES ($1)", [req.body.newItem]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  try {
    const title = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [
      title,
      id,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log("Error executing query:", err.stack);
  }
});

app.post("/delete", (req, res) => {
  try {
    db.query("DELETE FROM items WHERE id = ($1)", [req.body.deleteItemId]);
    res.redirect("/");
  } catch (err) {
    console.log("Error executing query: ", err.stack);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
