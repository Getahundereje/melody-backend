import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "..", "data", "spotify-top10.json");

let spotifyTopTen = null;

async function loadSpotifyTopTen() {
  try {
    spotifyTopTen =  JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch (error) {
    console.log(error);
  }
}

async function updateSpotifyTopTen(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    spotifyTopTen = data;
  } catch (error) {
    console.log(error);
  }
}

function getSpotifyTopTen() {
  return spotifyTopTen;
}

export { getSpotifyTopTen, loadSpotifyTopTen, updateSpotifyTopTen };
