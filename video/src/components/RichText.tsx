export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? <em key={i}>{part.slice(2, -2)}</em> : <span key={i}>{part}</span>,
      )}
    </>
  );
}
