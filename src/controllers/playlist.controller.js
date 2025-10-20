import catchAsyncError from "../utils/catchAsyncError.js";
import AppError from "../utils/appError.js";
import {
  addTracksToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllUserPlaylists,
  getDefaultPlaylistTracks,
  getPlaylistTracks,
  removeTrackFromPlaylist,
} from "../models/playlist/playlist.model.js";
import PlaylistType from "../enums/playlistTypes.js";

export const handleCreatePlaylist = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;
  const image = req?.file ? req.file.filename : null;
  console.log(image);

  if (!name)
    return next(new AppError("Please provide all required fields.", 400));

  const playlist = await createPlaylist({
    user: "68f4047e8ea6aee8ad9c34cf",
    name,
    description,
    image,
  });

  return res.status(201).json({
    status: "success",
    data: playlist,
  });
});

export const handleDeletePlaylist = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id)
    return next(new AppError("Please provide all required fields.", 400));

  await deletePlaylist(id);

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

export const handleAddTracksToPlaylist = catchAsyncError(
  async (req, res, next) => {
    const { tracks } = req.body;
    const { id } = req.params;

    if (!tracks?.length)
      return next(new AppError("Please provide all required fields.", 400));

    await addTracksToPlaylist(id, tracks);

    return res.status(201).json({
      status: "success",
      data: null,
    });
  }
);

export const handleAddTracksToFavoritePlaylist = catchAsyncError(
  async (req, res, next) => {
    const { tracks } = req.body;
  }
);

export const handleRemoveTrackFromPlaylist = catchAsyncError(
  async (req, res, next) => {
    const { id, trackId } = req.params;

    if (!trackId || !id)
      return next(new AppError("Please provide all required fields.", 400));

    await removeTrackFromPlaylist(id, trackId);

    return res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const handleGetAllUserPlaylists = catchAsyncError(
  async (req, res, next) => {
    return res.status(200).json({
      status: "success",
      data: {
        playlists: await getAllUserPlaylists("68f4047e8ea6aee8ad9c34cf"),
      },
    });
  }
);

export const handleGetPlaylistTracks = catchAsyncError(
  async (req, res, next) => {
    const { id, type, page } = req.query;

    if (!id && !type)
      return next(new AppError("Please provide all required fields.", 400));

    if (type === PlaylistType.CUSTOM)
      return next(
        new AppError(
          "Please provide playlist id to access custom playlists.",
          400
        )
      );

    const {
      total,
      page: currentPage,
      limit,
      tracks,
    } = id
      ? await getPlaylistTracks(id, page)
      : await getDefaultPlaylistTracks(type, page);

    return res.status(200).json({
      status: "success",
      nextPage: Number(currentPage) + 1,
      hasNext: currentPage * limit < total,
      results: {
        tracks,
      },
    });
  }
);

export const handleGetDefaultPlaylistTracks = catchAsyncError(
  async (req, res, next) => {
    const { type } = req.params;
    const { page } = req.query;

    if (!type)
      return next(new AppError("Please provide all required fields.", 400));

    const {
      total,
      page: currentPage,
      limit,
      tracks,
    } = await getDefaultPlaylistTracks(id, page);

    return res.status(200).json({
      status: "success",
      nextPage: currentPage + 1,
      hasNext: currentPage * limit < total,
      results: {
        tracks,
      },
    });
  }
);
