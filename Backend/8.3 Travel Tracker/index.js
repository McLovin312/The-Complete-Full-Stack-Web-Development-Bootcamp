import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ------------ GET REQUEST ------------
app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  res.render("index.ejs", { countries: countries, total: countries.length });
});

// ------------ POST REQUEST ------------
app.post("/add", async (req, res) => {
  try {
    const enteredCountry = req.body.country;
    if (!enteredCountry || !enteredCountry.trim()) {
      const visitedResult = await db.query("SELECT country_code FROM visited_countries");
      let visitedCodes = [];
      visitedResult.rows.forEach((country) => {
        visitedCodes.push(country.country_code);
      });

      return res.render("index.ejs", {
        countries: visitedCodes,
        total: visitedCodes.length,
        error: "Country cannot be null, try again"
      });
    }

    const finalCountryString = enteredCountry.trim();

    const result = await db.query(
      "SELECT country_code, country_name FROM countries",
    );
    const visitedCountry = await db.query(
      "SELECT country_code FROM visited_countries",
    );

    const visited = visitedCountry.rows.map((country) => country.country_code);
    const countries = result.rows;

    const foundCountryIndex = countries.findIndex(
      (country) =>
        country.country_name.toLowerCase() === finalCountryString.toLowerCase(),
    );

    if (foundCountryIndex === -1) {
      const visitedResult = await db.query("SELECT country_code FROM visited_countries");
      let visitedCodes = [];
      visitedResult.rows.forEach((country) => {
        visitedCodes.push(country.country_code);
      });

      return res.render("index.ejs", {
        countries: visitedCodes,
        total: visitedCodes.length,
        error: "Country name does not exist, try again"
      });
    }

    const foundCountryCode = countries[foundCountryIndex].country_code;

    if (visited.includes(foundCountryCode)) {
      return res.render("index.ejs", {
        countries: visited,
        total: visited.length,
        error: "Country has already been added, try again"
      });
    }

    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES($1)",
      [foundCountryCode],
    );

    res.redirect("/");
  } catch (err) {
    console.error(err.stack);
    const result = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });

    res.status(500).render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "An unexpected error occurred, try again"
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});