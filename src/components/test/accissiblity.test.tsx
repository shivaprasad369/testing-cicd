import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserDashboard from "../Dashboard";

expect.extend(toHaveNoViolations);

test("accessible", async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <UserDashboard />
    </QueryClientProvider>,
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
