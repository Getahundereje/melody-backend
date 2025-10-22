import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deleteImage(imagePath) {
  try {
    const filePath = path.join(__dirname, "..", imagePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.log("File not found:", filePath);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

export default deleteImage;
