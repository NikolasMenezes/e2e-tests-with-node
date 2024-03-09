import { it, describe, before, after } from "node:test";
import { ok, strictEqual } from "node:assert";

import { products as dbProdcts } from "./data/products.js";

const API_URL = "http://localhost:3000";

describe("tests api endpoints", () => {
  let _server = {};
  let _authToken = "";

  async function makeRequest(endpoint, options) {
    const request = await fetch(`${API_URL}${endpoint}`, {
      method: options.method ?? "GET",
      headers: options.headers ?? {},
      body: JSON.stringify(options.data),
    });

    return await request.json();
  }

  before(async () => {
    _server = (await import("./api.js")).app.listen(3000);

    const allowedCredencials = {
      email: "Nikolas",
      password: "tititi",
    };

    const { token } = await makeRequest("/auth", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: allowedCredencials,
    });

    _authToken = token;
  });

  // TODO: Stop server after tests
  // after(() => {})

  it("Should recieve an 401 status from the api", async () => {
    const expected = JSON.stringify({ error: "Unauthorized" });

    const request = await makeRequest("/products", {
      headers: {
        authorization: `Bearer cascsabuscaiubcsaiubcasiucsabiucbas`,
      },
    });

    strictEqual(expected, request);
  });

  it("Should get all products information from /products endpoint", async () => {
    const products = await makeRequest("/products", {
      headers: {
        authorization: `Bearer ${_authToken}`,
      },
    });

    ok("Get all products");
    strictEqual(JSON.stringify(products), JSON.stringify(dbProdcts));
  });
});
