import fs from "fs/promises";

import getDataFilePath from "./getDataFilePath.js";
import { BILLBOARD_CHARTS } from "./BillboardCharts.js";

const MusicData = {};

async function loadMusicData(filename) {
  try {
    MusicData[filename] = JSON.parse(
      await fs.readFile(getDataFilePath(`${filename}-music-data.json`), "utf-8")
    );
  } catch (error) {
    console.log(error);
  }
}

async function loadAllMusicData() {
  const loadAllMusicDataPromises = Object.keys(BILLBOARD_CHARTS).forEach(
    async (chartName) => {
      await loadMusicData(chartName);
    }
  );

  if (!loadAllMusicDataPromises) return;

  await Promise.all(loadAllMusicDataPromises);
}

async function updateMusicData(data, filename) {
  try {
    await fs.writeFile(
      getDataFilePath(`${filename}-music-data.json`),
      JSON.stringify(data, null, 2)
    );
    MusicData[filename] = data;
  } catch (error) {
    console.log(error);
  }
}

function getMusicData(filename) {
  return MusicData[filename];
}

export { getMusicData, loadAllMusicData, updateMusicData };
