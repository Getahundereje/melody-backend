import play from "play-dl"
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readSpotifyDataFile() {
    try {
        if (play.is_expired()) {
            await play.refreshToken()
        }

        const data = await fs.readFile(path.join(__dirname, "..", "..", ".data", "spotify.data"), "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading Spotify data file:", error);
    }
}
