import express, { json } from "express";
import JWT from "jsonwebtoken";

import { products } from "./data/products.js";

const app = express();
app.use(json());

const allowedCredencials = {
  email: "Nikolas",
  password: "tititi",
};

const JWT_SECRET = "batatinhaQuandoNasceSeEsparramaPeloChao";

function authorizationHandler(token, JWT_SECRET) {
  try {
    JWT.verify(token, JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

function verifyHeaders(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json(JSON.stringify({ error: "Unauthorized" }));
  }

  const token = req.headers.authorization.split(" ")[1];

  const isValid = authorizationHandler(token, JWT_SECRET);

  if (!isValid)
    return res.status(401).json(JSON.stringify({ error: "Unauthorized" }));

  next();
}

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  if (
    email === allowedCredencials.email &&
    password === allowedCredencials.password
  ) {
    const token = JWT.sign(allowedCredencials, JWT_SECRET);
    return res.status(200).json({ status: "Logged in", token });
  }

  return res.json({ error: "Unauthorized" }, 401);
});

app.get("/products", verifyHeaders, (req, res) => {
  return res.status(200).json(products);
});

export { app };
