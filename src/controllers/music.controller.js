import catchAsyncError from "../utils/catchAsyncError.js";
import search, {
  getAlbumTracks,
  getArtistAlbums,
  getArtistTracks,
  getNewSingles,
  getPopularTracks,
  getTrackStreamUrl,
} from "../api/spotify.js";
import AppError from "../utils/appError.js";
import https from "https";

const handleGetArtistAlbums = catchAsyncError(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      albums: await getArtistAlbums(req.params.id),
    },
  });
});

const handleGetArtistTracks = catchAsyncError(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tracks: await getArtistTracks(req.params.id),
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
    data: await search(term, type),
  });
});

const handleGetNewSingles = catchAsyncError(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: {
      singles: await getNewSingles(),
    },
  });
});

const handleGetPopularTracks = catchAsyncError(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: {
      tracks: await getPopularTracks(),
    }
  });
});

const handleStream = catchAsyncError(async (req, res, next) => {
  const { trackName, artistName } = req.query;

  if (!trackName || !artistName) {
    return next(new AppError("Invalid request", 400));
  }

  const url = await getTrackStreamUrl(trackName, artistName);

  // res.set({
  //   "Content-Type": "audio/mpeg",
  //   "Transfer-Encoding": "chunked",
  // });

  return res.status(200).json({
    status: "Success",
    data: url,
  });
});

export {
  handleGetArtistAlbums,
  handleGetArtistTracks,
  handleGetAlbumTracks,
  handleSearch,
  handleGetNewSingles,
  handleGetPopularTracks,
  handleStream,
};
