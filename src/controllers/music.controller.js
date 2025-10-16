import axios from "axios";
import playdl from "play-dl";

import catchAsyncError from "../utils/catchAsyncError.js";
import search, {
  getAlbumInfo,
  getAlbumTracks,
  getArtistInfo,
  getNewSingles,
  getPopularTracks,
  getTopAlbums,
  getTopArtists,
} from "../api/spotify.js";
import AppError from "../utils/appError.js";

export const handleGetArtistInfo = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Invalid request", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      artist: await getArtistInfo(id),
    },
  });
});

export const handleGetAlbumInfo = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Invalid request", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      album: await getAlbumInfo(id),
    },
  });
});

const handleGetAlbumTracks = catchAsyncError(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tracks: await getAlbumTracks(req.params.id),
    },
  });
});

const handleSearch = catchAsyncError(async (req, res, next) => {
  const { term, type } = req.body;
  if (!term || !type) {
    return next(new AppError("Invalid request", 400));
  }

  return res.status(200).json({
    status: "success",
    results: await search(term, type),
  });
});

const handleGetNewSingles = catchAsyncError(async (req, res) => {
  return res.status(200).json({
    status: "success",
    results: {
      tracks: await getNewSingles(),
    },
  });
});

const handleGetPopularTracks = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const popularSongs = await getPopularTracks();

  return res.status(200).json({
    status: "success",
    nextPage: page + 1,
    hasNext: page * limit < popularSongs.length,
    results: {
      tracks: popularSongs.slice((page - 1) * limit, page * limit),
    },
  });
});

const handleGetTopArtists = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const topArtists = await getTopArtists();

  return res.status(200).json({
    status: "success",
    nextPage: page + 1,
    hasNext: page * limit < topArtists.length,
    results: {
      artists: topArtists.slice((page - 1) * limit, page * limit),
    },
  });
});

export const handleGetTopAlbums = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const topAlbums = await getTopAlbums();

  return res.status(200).json({
    status: "success",
    nextPage: page + 1,
    hasNext: page * limit < topAlbums.length,
    results: {
      albums: topAlbums.slice((page - 1) * limit, page * limit),
    },
  });
});

const musicStreamUrl = {};

function findMatchingUrl(results, targetDurationMs) {
  const regex =
    /\(\s*(?:official\s*(?:audio|video|lyrics?|lyric\s*video|video\s*lyrics?|visualizer)|audio\s*only|audio|lyrics?|lyric\s*video|video\s*lyrics?|visualizer)\s*\)|\[\s*(?:official\s*(?:audio|video|lyrics?|lyric\s*video|video\s*lyrics?|visualizer)|audio\s*only|audio|lyrics?|lyric\s*video|video\s*lyrics?|visualizer)\s*\]/i;

  const targetDuration = targetDurationMs / 1000;

  const match = results.find((result) => {
    const titleMatches = regex.test(result.title);
    const durationMatches =
      result.durationInSec >= targetDuration &&
      result.durationInSec <= targetDuration + 3;

    return titleMatches && durationMatches;
  });

  return match.url;
}

const handleStream = catchAsyncError(async (req, res) => {
  const { name, artists, duration } = req.query;
  const key = `${name} ${Array.isArray(artists) ? artists.join(", ") : artists}`;

  if (musicStreamUrl[key]) {
    return res.status(200).json({
      audio_url: musicStreamUrl[key],
    });
  }

  const results = await playdl.search(`${key}`);

  const url = findMatchingUrl(results, duration);
  const response = await axios.get("http://127.0.0.1:5000/stream_audio", {
    params: { url },
  });

  const streamUrl = response.data;
  musicStreamUrl[key] = streamUrl.audio_url;

  return res.status(200).json(streamUrl);
});

export {
  handleGetAlbumTracks,
  handleSearch,
  handleGetNewSingles,
  handleGetPopularTracks,
  handleGetTopArtists,
  handleStream,
};
