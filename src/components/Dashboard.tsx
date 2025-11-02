// UserDashboard.jsx (simplified)
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api";

export default function UserDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  if (isLoading) return <div>Loading</div>;
  return <div>{data.data[0]?.name}</div>;
}
