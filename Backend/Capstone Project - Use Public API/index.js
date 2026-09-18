import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const weatherAPIKey = ""; 
const openuvAPIKey = ""; 

app.get("/", (req, res) => {
  res.render("index.ejs", { 
    tempC: null,
    tempF: null, 
    uvIndex: null,
    joke: null,
    cocktail: null,
    crypto: null
  });
});

app.post("/submit-coordinates", async (req, res) => {
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.latitude}&lon=${req.body.longitude}&appid=${weatherAPIKey}&units=metric`
    );

    let tempToF = (weatherResponse.data.main.temp * 9 / 5) + 32;
    tempToF = parseFloat(tempToF).toFixed(2);
    
    let uvData = null;
    try {
        const uvResponse = await axios.get(
            `https://api.openuv.io/api/v1/uv?lat=${req.body.latitude}&lng=${req.body.longitude}`,
            { headers: { "x-access-token": openuvAPIKey } }
        );
        uvData = parseFloat(uvResponse.data.result.uv).toFixed(1);
    } catch (uvError) {
        uvData = "Unavailable";
    }

    res.render("index.ejs", {
      tempC: weatherResponse.data.main.temp,
      tempF: tempToF,
      uvIndex: uvData,
      joke: null,
      cocktail: null,
      crypto: null
    });
  } catch (error) {
    res.render("index.ejs", {
      tempC: null,
      tempF: null,
      uvIndex: null,
      cocktail: null,
      crypto: null,
      joke: "Error fetching weather data." 
    });
  }
});

app.post("/joke", async (req, res) => {
    try {
    const response = await axios.get(`https://v2.jokeapi.dev/joke/Any`);
    const jokeData = response.data;
    
    let fetchedJoke = "";
    if (jokeData.type === "single") {
        fetchedJoke = jokeData.joke;
    } else {
        fetchedJoke = `${jokeData.setup} - ${jokeData.delivery}`;
    }

    res.render("index.ejs", {
      tempC: null, tempF: null, uvIndex: null, cocktail: null, crypto: null,
      joke: fetchedJoke
    });
  } catch (error) {
    res.render("index.ejs", {
      tempC: null, tempF: null, uvIndex: null, cocktail: null, crypto: null,
      joke: "Error fetching joke."
    });
  }
});

app.post("/cocktail", async (req, res) => {
    try {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
        const drink = response.data.drinks[0];

        const ingredientsArray = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (!ingredient) break; 
            const measurementText = measure ? `${measure.trim()} ` : "";
            ingredientsArray.push(`${measurementText}${ingredient}`);
        }
        
        const cleanCocktailData = {
            name: drink.strDrink,
            image: drink.strDrinkThumb,
            instructions: drink.strInstructions,
            ingredients: ingredientsArray
        };

        res.render("index.ejs", {
            tempC: null, tempF: null, uvIndex: null, joke: null, crypto: null,
            cocktail: cleanCocktailData
        });
    } catch (error) {
        res.render("index.ejs", {
            tempC: null, tempF: null, uvIndex: null, joke: null, crypto: null,
            cocktail: "error"
        });
    }
});

app.post("/crypto", async (req, res) => {
    try {
        const priceRes = await axios.get(`https://api.blockchain.com/v3/exchange/tickers/BTC-USD`);
        const currentPrice = priceRes.data.last_trade_price;

        const chartRes = await axios.get(`https://api.blockchain.info/charts/market-price?timespan=30days&format=json`);
        
        const labels = chartRes.data.values.map(val => {
            const date = new Date(val.x * 1000);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const prices = chartRes.data.values.map(val => val.y);

        res.render("index.ejs", {
            tempC: null, tempF: null, uvIndex: null, joke: null, cocktail: null,
            crypto: { price: currentPrice, labels, prices }
        });
    } catch (error) {
        res.render("index.ejs", {
            tempC: null, tempF: null, uvIndex: null, joke: null, cocktail: null,
            crypto: "error"
        });
    }
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});