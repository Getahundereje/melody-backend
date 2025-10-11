import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDataFilePath(filename) {
  return path.join(__dirname, "..", "data", filename);
}

export default getDataFilePath;
