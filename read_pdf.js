import fs from "fs";
import pdf from "pdf-parse";

const filePath = "/Users/michelle.anderson/Downloads/Sirsha_MissionControl_BuildBrief.pdf";

async function readPdf() {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        console.log(data.text);
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

readPdf();
