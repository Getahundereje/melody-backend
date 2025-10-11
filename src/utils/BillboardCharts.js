import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import cron from "node-cron";

import getDataFilePath from "./getDataFilePath.js";

const BILLBOARD_CHARTS = {
  "billboard-200": "billboard-200",
  "artist-100": "artist-100",
  "hot-100": "hot-100",
};

const billboardCartsData = {};

async function getLastBillboardChartData(filename) {
  try {
    return JSON.parse(
      await fs.readFile(getDataFilePath(`${filename}.json`), "utf-8")
    );
  } catch (error) {
    return null;
  }
}

async function fetchBillboardChart(chartName) {
  const data = {
    issueDate: "",
    data: [],
  };

  try {
    const { data: html } = await axios.get(
      `https://www.billboard.com/charts/${chartName}/`
    );
    const $ = cheerio.load(html);

    data.issueDate = $(".charts-title").find("span").eq(0).text().trim();
    const lastBillboardChartData =
      billboardCartsData[chartName] ??
      (await getLastBillboardChartData(chartName));

    if (
      lastBillboardChartData &&
      data.issueDate === lastBillboardChartData.issueDate
    ) {
      billboardCartsData[chartName] = lastBillboardChartData;
      return;
    }

    $(".a-chart-result-item-container")
      .slice(0, 100)
      .each((i, el) => {
        const title = $(el).find("h3").text().trim();
        const artist = !chartName.includes("artist")
          ? $(el).find("span").eq(0).text().trim()
          : "";
        data.data.push({
          [i + 1]: `${title}${
            artist ? ", " + artist.replace("Featuring", ", ") : ""
          }`,
        });
      });

    await fs.writeFile(
      getDataFilePath(`${chartName}.json`),
      JSON.stringify(data, null, 2)
    );
    billboardCartsData[chartName] = data;
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllBillboardCharts() {
  const fetchBillboardChartPropmises = Object.keys(BILLBOARD_CHARTS).map(
    async (chartName) => {
      await fetchBillboardChart(BILLBOARD_CHARTS[chartName]);
    }
  );

  await Promise.all(fetchBillboardChartPropmises);
}

async function loadBillboardChartData() {
  await fetchAllBillboardCharts();

  cron.schedule("0 9 * * 2", async () => {
    await fetchAllBillboardCharts();
  });
}

function getBillboardChartData(chartName) {
  return billboardCartsData[chartName];
}

export { BILLBOARD_CHARTS, loadBillboardChartData, getBillboardChartData };
