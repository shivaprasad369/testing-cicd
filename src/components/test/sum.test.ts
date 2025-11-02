export function sum(a: number, b: number): number {
  return a + b;
}

describe("Sum", () => {
  test("adds numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
