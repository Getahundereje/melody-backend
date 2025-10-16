import play from "play-dl";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

import search from "../api/spotify.js";
import { getBillboardChartData } from "./BillboardCharts.js";
import { getMusicData, updateMusicData } from "./musicData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readSpotifyDataFile() {
  try {
    if (play.is_expired()) {
      await play.refreshToken();
    }

    const data = await fs.readFile(
      path.join(__dirname, "..", "..", ".data", "spotify.data"),
      "utf8",
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading Spotify data file:", error);
  }
}

export async function getBillboardChartSpotifyData(filename, dataType) {
  const billboardData = getBillboardChartData(filename);
  let musicData = getMusicData(filename);

  if (!musicData || musicData.issueDate !== billboardData.issueDate) {
    const spotifyDataPromises = billboardData.data.map(async (data, index) => {
      const term = data[`${index + 1}`].split(":")[0];
      const result = await search(term, dataType, 10);
      return result[`${dataType === "songs" ? "tracks" : dataType}`].find(
        (music) => !/remix|live|edit|version/i.test(music.name),
      );
    });

    await updateMusicData(
      {
        issueDate: billboardData.issueDate,
        [dataType]: await Promise.all(spotifyDataPromises),
      },
      filename,
    );
    musicData = getMusicData(filename);
  }

  return musicData[dataType];
}
