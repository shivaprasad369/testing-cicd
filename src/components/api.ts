const API_BASE_URL =
  process.env.NODE_ENV === "test" ? "http://localhost:3000" : "";

export async function getUser() {
  const response = await fetch(`${API_BASE_URL}/api/user`);
  const data = await response.json();
  return data;
}

export async function getUserById(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/user/${id}`);
  const data = await response.json();
  return data;
}

export async function createUser(userData: {
  name: string;
  email: string;
  age?: number;
  role?: string;
  isActive?: boolean;
}) {
  const response = await fetch(`${API_BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
}
