import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/random/");
    res.render("index.ejs", {
      secret: result.data.secret,
      user: result.data.username
    });
  } catch (error) {
    console.log(error);
    res.render("index.ejs", {
      secret: error.message,
      user: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
