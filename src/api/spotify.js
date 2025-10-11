import play from "play-dl";
import axios from "axios";

import {
  processAlbumData,
  processArtistData,
  processTrackData,
} from "../utils/processSpotifyData.js";
import {
  getBillboardChartSpotifyData,
  readSpotifyDataFile,
} from "../utils/spotifyData.js";
import AppError from "../utils/appError.js";
import { BILLBOARD_CHARTS } from "../utils/BillboardCharts.js";

const SEARCH_TYPE = {
  all: ["track", "album", "artist"],
  songs: "track",
  albums: "album",
  artists: "artist",
};

const DATA_PROCESSORS = {
  tracks: processTrackData,
  albums: processAlbumData,
  artists: processArtistData,
};

let spotifyAxiosApi = null;
let spotifyData = null;

function setupSpotifyBaseUrl(token) {
  spotifyAxiosApi = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function fetchSpotifyData(url) {
  if (play.is_expired()) {
    await play.refreshToken();
    spotifyData = await readSpotifyDataFile();
    setupSpotifyBaseUrl(spotifyData.access_token);
  }

  if (!spotifyAxiosApi) {
    spotifyData = await readSpotifyDataFile();
    setupSpotifyBaseUrl(spotifyData.access_token);
  }

  try {
    const { data } = await spotifyAxiosApi.get(url);
    return data;
  } catch (error) {
    throw new AppError(error.message, error.status);
  }
}

export async function getAlbumTracks(id) {
  const { tracks, ...album } = await fetchSpotifyData(
    `/albums/${id}?market=ET`
  );

  return tracks.items.map((track) => {
    return processTrackData({ ...track, album });
  });
}

async function getArtistAlbums(id) {
  const data = await fetchSpotifyData(
    `/artists/${id}/albums?include_groups=album&market=ET&limit=10`
  );

  return data.items.reduce((albums, album) => {
    const name = album.name.toLowerCase();
    if (name.includes("deluxe edition") || name.includes("bonus")) {
      return albums;
    }

    albums.push(processAlbumData(album));
    return albums;
  }, []);
}

async function getArtistSingles(id) {
  const data = await fetchSpotifyData(
    `/artists/${id}/albums?include_groups=single&market=ET&limit=50`
  );

  return data.items.reduce((tracks, track) => {
    const name = track.name.toLowerCase();

    if (
      name.includes("deluxe edition") ||
      name.includes("bonus") ||
      total_tracks > 1
    ) {
      return tracks;
    }

    tracks.push(processTrackData(track));

    return tracks;
  }, []);
}

async function search(term, searchType = "all", size = 20) {
  if (!SEARCH_TYPE[searchType]) {
    throw new AppError(`Please provide appropriate search type param.`, 400);
  }

  const searchTypes =
    searchType === "all" ? SEARCH_TYPE[searchType] : [SEARCH_TYPE[searchType]];
  const limit = searchType === "all" ? 10 : size;

  let data = await fetchSpotifyData(
    `/search?q="${term}"&type=${searchTypes.join(",")}&market=ET&limit=${limit}`
  );

  return Object.keys(data).reduce((acc, key) => {
    acc[key] = data[key].items
      .filter((_, index) => index < limit)
      .map(DATA_PROCESSORS[key]);
    return acc;
  }, {});
}

export async function getTrackStreamUrl(trackName, artistName) {
  return await axios.get(
    `https://f7fa9dd569a5.ngrok-free.app/stream-url?trackName=${trackName}&artistName=${artistName}`
  );
}

export async function getNewSingles() {
  const data = await fetchSpotifyData(
    `/browse/new-releases?country=ET&limit=50`
  );

  return data.albums.items
    .filter(
      (album) => album.album_type === "single" && album.total_tracks === 1
    )
    .map(processTrackData);
}

export async function getPopularTracks() {
  return await getBillboardChartSpotifyData(
    BILLBOARD_CHARTS["hot-100"],
    "songs"
  );
}

export async function getTopArtists() {
  return await getBillboardChartSpotifyData(
    BILLBOARD_CHARTS["artist-100"],
    "artists"
  );
}

export async function getTopAlbums() {
  return await getBillboardChartSpotifyData(
    BILLBOARD_CHARTS["billboard-200"],
    "albums"
  );
}

export async function getArtistTopTracks(id) {
  const data = await fetchSpotifyData(`artists/${id}/top-tracks`);

  return data?.tracks?.map((track) => {
    return processTrackData(track);
  }, []);
}

export async function getArtistInfo(id) {
  const [artist, topTracks, artistAlbums] = await Promise.all([
    fetchSpotifyData(`/artists/${id}`),
    getArtistTopTracks(id),
    getArtistAlbums(id),
  ]);

  return {
    ...processArtistData(artist),
    tracks: topTracks,
    albums: artistAlbums,
  };
}

export async function getAlbumInfo(id) {
  const [album, tracks] = await Promise.all([
    fetchSpotifyData(`/albums/${id}`),
    getAlbumTracks(id),
  ]);

  return {
    ...processAlbumData(album),
    tracks,
  };
}

export default search;
