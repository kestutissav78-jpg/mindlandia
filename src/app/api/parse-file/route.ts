import { NextRequest } from "next/server";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as pdfParseModule from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const name = file.name.toLowerCase();
    let text = "";

    if (name.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      text = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        return `Sheet: ${sheetName}\n${XLSX.utils.sheet_to_csv(sheet)}`;
      }).join("\n\n");
    } else if (name.endsWith(".pptx")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { parseOffice } = require("officeparser");
      text = await new Promise<string>((resolve, reject) => {
        parseOffice(buffer, (data: string, err: Error) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } else if (name.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else {
      return Response.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const trimmed = text.replace(/\s+/g, " ").trim().slice(0, 8000);

    return Response.json({ text: trimmed, name: file.name });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Parse failed" },
      { status: 500 }
    );
  }
}
