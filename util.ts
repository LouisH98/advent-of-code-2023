export async function toLines(path: string): Promise<string[]> {
  const file = Bun.file("./data.txt");
  const text = await file.text();
  return text.split("\n");
}
