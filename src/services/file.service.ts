import { BadRequest } from "../utils/errorHandler";
import pdfReader from 'pdf-parse'

export const fileService = {
    extractPdfText
}

async function extractPdfText(filePath: string): Promise<string> {
    // Fetch and parse PDF
    const ress = await fetch(filePath);
    if (!ress.ok) {
        throw new Error(`Failed to fetch PDF: ${ress.statusText}`);
    }
    const buffer = await ress.arrayBuffer();
    const pdfBuffer = Buffer.from(buffer);
    const pdfData = await pdfReader(pdfBuffer);
    return pdfData.text;
}