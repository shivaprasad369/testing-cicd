import { NextRequest, NextResponse } from "next/server";

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    age: 28,
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: "2024-01-15T10:30:00Z",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    age: 32,
    role: "Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: "2024-02-20T14:15:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    age: 25,
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    createdAt: "2024-03-10T09:45:00Z",
    isActive: false,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    age: 29,
    role: "Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    createdAt: "2024-03-25T16:20:00Z",
    isActive: true,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    age: 35,
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    createdAt: "2024-04-05T11:10:00Z",
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const role = searchParams.get("role");
    const active = searchParams.get("active");

    let filteredUsers = [...sampleUsers];

    // Filter by role
    if (role) {
      filteredUsers = filteredUsers.filter((user) =>
        user.role.toLowerCase().includes(role.toLowerCase()),
      );
    }

    // Filter by active status
    if (active !== null) {
      const isActive = active === "true";
      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === isActive,
      );
    }

    // Apply pagination
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        total: filteredUsers.length,
        limit,
        offset,
        hasMore: offset + limit < filteredUsers.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and email are required",
        },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = {
      id: sampleUsers.length + 1,
      name: body.name,
      email: body.email,
      age: body.age || null,
      role: body.role || "User",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.name}`,
      createdAt: new Date().toISOString(),
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    sampleUsers.push(newUser);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
