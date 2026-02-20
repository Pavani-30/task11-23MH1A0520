jest.mock("../models/Product", () => ({
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnValue({
      limit: jest.fn().mockResolvedValue([])
    })
  }),

  countDocuments: jest.fn().mockResolvedValue(0),

  insertMany: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  findById: jest.fn().mockResolvedValue(null),
  findByIdAndUpdate: jest.fn().mockResolvedValue(null),
  findByIdAndDelete: jest.fn().mockResolvedValue(null)
}));



const request = require("supertest");
const app = require("../server");

describe("GET /api/products", () => {

  it("should return paginated products", async () => {
    const res = await request(app).get("/api/products?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("products");
    expect(res.body).toHaveProperty("total");
  });

});
