process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const items = require("./fakeDb");

const miffy = { name: "miffy", price: 33 };

beforeEach(function () {
  items.push(miffy);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([miffy]);
  });
});

describe("GET /items/:name", () => {

  test("Get speciic item", async () => {
    const res = await request(app).get(`/items/${miffy.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(miffy);
  });

  test("Get non-existent item", async () => {
    const res = await request(app).get("/items/dne");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {

  test("Create item", async () => {
    const newMiffy = {name: "miffy2", price: 33};
    const res = await request(app).post(`/items`).send(newMiffy);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({added: newMiffy});
  });

  test("Create item with missing data", async () => {
    const newMiffy = {name: "miffy2"};
    const res = await request(app).post(`/items`).send(newMiffy);
    expect(res.statusCode).toBe(422);
  });

  test("Create item that already exists", async () => {
    const dupeMiffy = miffy;
    const res = await request(app).post(`/items`).send(dupeMiffy);
    expect(res.statusCode).toBe(409);
  });
});

describe("PATCH /items/:name", () => {

  test("Update speciic item", async () => {
    const newMiffy = {name: "miffy2", price: 33};
    const res = await request(app).patch(`/items/${miffy.name}`).send(newMiffy);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updated: newMiffy});
  });

  test("Update non-existent item", async () => {
    const res = await request(app).patch(`/items/dne`);
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {

  test("Delete speciic item", async () => {
    const res = await request(app).delete(`/items/${miffy.name}`);
    expect(res.statusCode).toBe(202);
  });

  test("Delete non-existent item", async () => {
    const res = await request(app).delete(`/items/dne`);
    expect(res.statusCode).toBe(404);
  });
});

