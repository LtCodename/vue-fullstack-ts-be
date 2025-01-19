const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const SECRET = "jwt_secret_key";

app.use(cors());
app.use(bodyParser.json());

var messages = [
  { user: "Lando", text: "Oscar, are you there?" },
  { user: "Oscar", text: "What's up?" },
];
var users = [
  { userName: "Lando", password: "ln03" },
  { userName: "Oscar", password: "os81" },
];

app.get("/messages", (_, res) => {
  res.send(messages);
});

app.get("/messages/:id", (req, res) => {
  res.send(messages[req.params.id]);
});

app.post("/messages", (req, res) => {
  const token = req.header("Authorization");
  const userId = jwt.decode(token, SECRET);
  const user = users[userId];
  let msg = { user: user.userName, text: req.body.message };
  messages.push(msg);
  res.json(msg);
});

app.post("/register", (req, res) => {
  let registerData = req.body;
  let newIndex = users.push(registerData);
  let userId = newIndex - 1;
  let token = jwt.sign(userId, SECRET);
  res.json(token);
});

app.post("/login", (req, res) => {
  let loginData = req.body;
  let userId = users.findIndex((user) => user.userName == loginData.userName);

  if (userId == -1)
    return res.status(401).send({ message: "name or password is invalid" });

  if (users[userId].password != loginData.password)
    return res.status(401).send({ message: "name or password is invalid" });

  let token = jwt.sign(userId, SECRET);
  res.json(token);
});

app.listen(port, () => console.log("app running"));
