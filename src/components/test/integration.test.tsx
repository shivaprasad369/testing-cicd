import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import UserDashboard from "../Dashboard";

test("shows user name", async () => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  render(
    <QueryClientProvider client={qc}>
      <UserDashboard />
    </QueryClientProvider>,
  );

  // Wait for loading to finish and user name to appear
  expect(
    await screen.findByText(/Loading|John|Jane|Mike|Sarah|David/),
  ).toBeInTheDocument();
}, 10000);
