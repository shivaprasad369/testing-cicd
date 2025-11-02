import { test, expect } from "@playwright/test";

test.describe("API Endpoints E2E Tests", () => {
  test("GET /api/user should return user data", async ({ request }) => {
    const response = await request.get("http://localhost:3000/api/user");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);

    // Verify user data structure
    const user = data.data[0];
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("role");
    expect(user).toHaveProperty("isActive");

    // Verify pagination
    expect(data.pagination).toHaveProperty("total");
    expect(data.pagination).toHaveProperty("limit");
    expect(data.pagination).toHaveProperty("offset");
    expect(data.pagination).toHaveProperty("hasMore");
  });

  test("GET /api/user with query parameters", async ({ request }) => {
    const response = await request.get(
      "http://localhost:3000/api/user?limit=2&offset=0",
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeLessThanOrEqual(2);
    expect(data.pagination.limit).toBe(2);
  });

  test("POST /api/user should create new user", async ({ request }) => {
    const newUser = {
      name: `E2E Test User ${Date.now()}`,
      email: `e2e${Date.now()}@example.com`,
      age: 25,
      role: "E2E Tester",
    };

    const response = await request.post("http://localhost:3000/api/user", {
      data: newUser,
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe(newUser.name);
    expect(data.data.email).toBe(newUser.email);
    expect(data.data.role).toBe(newUser.role);
    expect(data.message).toBe("User created successfully");
  });

  test("POST /api/user should validate required fields", async ({
    request,
  }) => {
    const invalidUser = {
      name: "", // Invalid: empty name
      email: "invalid-email", // Invalid: bad email format
    };

    const response = await request.post("http://localhost:3000/api/user", {
      data: invalidUser,
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Name and email are required");
  });

  test("API should handle filtering by role", async ({ request }) => {
    const response = await request.get(
      "http://localhost:3000/api/user?role=developer",
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);

    // All returned users should have 'developer' in their role
    data.data.forEach((user: { role: string }) => {
      expect(user.role.toLowerCase()).toContain("developer");
    });
  });

  test("API should handle filtering by active status", async ({ request }) => {
    const response = await request.get(
      "http://localhost:3000/api/user?active=true",
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);

    // All returned users should be active
    data.data.forEach((user: { isActive: boolean }) => {
      expect(user.isActive).toBe(true);
    });
  });
});
