const cacheService = require("../services/cacheService");

test("Cache set and get", async () => {
  await cacheService.set("test:key", { name: "Test" }, 10);
  const result = await cacheService.get("test:key");
  expect(result.name).toBe("Test");
});
