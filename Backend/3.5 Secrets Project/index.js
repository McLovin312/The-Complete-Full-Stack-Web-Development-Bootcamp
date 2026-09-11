//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var password = "ILoveProgramming";

app.use(bodyParser.urlencoded({extended: true}));

function checkPassword(req, res, next) {
  const userPassword = req.body["password"];
  
  if (userPassword === password) {
    req.userIsIsAuthorized = true;
  } else {
    req.userIsIsAuthorized = false;
  }
  
  next();
}

app.post("/check", checkPassword, (req, res) => {
  if (req.userIsIsAuthorized) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
  console.log(req.body);
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});