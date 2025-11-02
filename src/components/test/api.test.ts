import { getUser, createUser } from "../api";

describe("User API Integration Tests", () => {
  // Increase timeout for real API calls
  jest.setTimeout(10000);

  test("fetches users from real API", async () => {
    const result = await getUser();

    // Verify response structure
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("pagination");

    // Verify success response
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);

    // Verify user data structure
    const user = result.data[0];
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("role");
    expect(user).toHaveProperty("isActive");

    // Verify pagination structure
    expect(result.pagination).toHaveProperty("total");
    expect(result.pagination).toHaveProperty("limit");
    expect(result.pagination).toHaveProperty("offset");
    expect(result.pagination).toHaveProperty("hasMore");

    console.log("Fetched users:", result.data.length);
    console.log("First user:", user.name);
  });

  test("creates user via real API", async () => {
    const userData = {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      age: 25,
      role: "Tester",
    };

    const result = await createUser(userData);

    // Verify response structure
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("message");

    // Verify success response
    expect(result.success).toBe(true);
    expect(result.data.name).toBe(userData.name);
    expect(result.data.email).toBe(userData.email);
    expect(result.data.role).toBe(userData.role);
    expect(result.message).toBe("User created successfully");

    console.log("Created user:", result.data.name);
  });

  test("handles invalid user creation", async () => {
    const invalidUserData = {
      name: "", // Invalid: empty name
      email: "invalid-email", // Invalid: bad email format
    };

    const result = await createUser(invalidUserData);

    // Should return error response
    expect(result.success).toBe(false);
    expect(result).toHaveProperty("error");

    console.log("Error response:", result.error);
  });

  test("fetches users with query parameters", async () => {
    // Test with limit parameter
    const response = await fetch("http://localhost:3000/api/user?limit=2");
    const result = await response.json();

    expect(result.success).toBe(true);
    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.pagination.limit).toBe(2);

    console.log("Limited users:", result.data.length);
  });
});
