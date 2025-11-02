export function Sum({ a, b }: { a: number; b: number }): React.ReactNode {
  return (
    <div>
      <h1>Sum</h1>
      <p>{a + b}</p>
    </div>
  );
}

export default Sum;
