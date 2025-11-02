import { render, screen } from "@testing-library/react";
import Hello from "../Hello";

describe("Hello", () => {
  test("renders greeting", () => {
    render(<Hello name="Shiva" />);
    expect(screen.getByText(/Hello Shiva/i)).toBeInTheDocument();
  });
});
