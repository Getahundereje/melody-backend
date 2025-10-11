import catchAsyncError from "../utils/catchAsyncError.js";
import search, {
  getAlbumInfo,
  getAlbumTracks,
  getArtistInfo,
  getNewSingles,
  getPopularTracks,
  getTopAlbums,
  getTopArtists,
  getTrackStreamUrl,
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
      artists: topAlbums.slice((page - 1) * limit, page * limit),
    },
  });
});

const handleStream = catchAsyncError(async (req, res, next) => {
  const filePath = getDataFilePath("Interlude.mp3");
  console.log(filePath)

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
  };

  res.writeHead(206, headers);
  const stream = fs.createReadStream(filePath, { start, end });
  stream.pipe(res);

});

export {
  handleGetAlbumTracks,
  handleSearch,
  handleGetNewSingles,
  handleGetPopularTracks,
  handleGetTopArtists,
  handleStream,
};
