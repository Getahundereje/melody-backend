import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import cron from "node-cron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "..", "data", "billboard-top10.json");

let billboardTopTen = null;

async function getLastBillboardTopTen() {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch (error) {
    return null;
  }
}

async function fetchBillboardTopTen() {
  const data = {
    issueDate: "",
    songs: [],
  };

  try {
    const { data: html } = await axios.get(
      "https://www.billboard.com/charts/hot-100/"
    );
    const $ = cheerio.load(html);

    data.issueDate = $(".charts-title").find("span").eq(0).text().trim();
    const lastBillboardTopTen = billboardTopTen ?? await getLastBillboardTopTen();
    
    if (lastBillboardTopTen && data.issueDate === lastBillboardTopTen.issueDate) {
      billboardTopTen = lastBillboardTopTen;
      return;
    }

    $(".a-chart-result-item-container")
      .slice(0, 10)
      .each((i, el) => {
        const title = $(el).find("h3").text().trim();
        const artist = $(el).find("span").eq(0).text().trim();
        data.songs.push({ [i + 1]: `${title}, ${artist.replace("Featuring", ", ")}` });
      });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    billboardTopTen = data;
  } catch (error) {
    console.log(error);
  }
}

async function loadBillboardTopTenData() {
  await fetchBillboardTopTen();
  cron.schedule("0 9 * * 2", async () => {
    await fetchBillboardTopTen();
  });
}

function getBillboardTopTen() {
  return billboardTopTen;
}

export { loadBillboardTopTenData, getBillboardTopTen };
