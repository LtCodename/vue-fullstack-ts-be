const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;
const SECRET = "jwt_secret_key";

app.use(cors());
app.use(bodyParser.json());

let messages = [
  { user: "Lando", text: "Oscar, are you there?" },
  { user: "Oscar", text: "What's up?" },
];
let users = [
  { userName: "Lando", password: "ln03" },
  { userName: "Oscar", password: "os81" },
];

// Get all messages
app.get("/messages", (_, res) => {
  res.send(messages);
});

// Get individual message
app.get("/messages/:id", (req, res) => {
  res.send(messages[req.params.id]);
});

// Add new message
app.post("/messages", (req, res) => {
  const token = req.header("Authorization");
  const userId = jwt.decode(token, SECRET);
  const user = users[userId];
  const msg = { user: user.userName, text: req.body.message };
  messages.push(msg);
  res.json(msg);
});

// Register new user
app.post("/register", (req, res) => {
  const registerData = req.body;
  const newIndex = users.push(registerData);
  const userId = newIndex - 1;
  const token = jwt.sign(userId, SECRET);
  res.json(token);
});

// Login user
app.post("/login", (req, res) => {
  const loginData = req.body;
  const userId = users.findIndex((user) => user.userName == loginData.userName);

  if (userId == -1)
    return res.status(401).send({ message: "Name or password is invalid" });

  if (users[userId].password != loginData.password)
    return res.status(401).send({ message: "Name or password is invalid" });

  const token = jwt.sign(userId, SECRET);
  res.json(token);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
