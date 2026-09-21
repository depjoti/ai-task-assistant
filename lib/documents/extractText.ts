import { extractText as extractPdfText } from "unpdf";

export async function extractText(file: { name: string; type: string; buffer: ArrayBuffer }): Promise<string> {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    const { text } = await extractPdfText(new Uint8Array(file.buffer), { mergePages: true });
    return text;
  }

  return new TextDecoder().decode(file.buffer);
}
