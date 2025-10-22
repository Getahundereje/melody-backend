import catchAsyncError from "../utils/catchAsyncError.js";
import AppError from "../utils/appError.js";
import {
  addTracksToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllUserPlaylists,
  getDefaultPlaylistTracks,
  getPlaylistTracks,
  removeTracksFromPlaylist,
  updatePlaylist,
} from "../models/playlist/playlist.model.js";
import PlaylistType from "../enums/playlistTypes.js";

export const handleCreatePlaylist = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;
  const image = req?.file ? req.file.filename : null;

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

export const handleUpdatePlaylist = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req?.file ? req.file.filename : null;

  if (!name || !id)
    return next(new AppError("Please provide all required fields.", 400));

  const playlist = await updatePlaylist(id, {
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
    const { id } = req.params;
    const { tracks } = req.body;

    if (!tracks?.length)
      return next(new AppError("Please provide all required fields.", 400));

    await addTracksToPlaylist(id, tracks);

    return res.status(201).json({
      status: "success",
      data: null,
    });
  }
);

export const handleRemoveTracksFromPlaylist = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { tracks } = req.body;

    if (!tracks?.length || !id)
      return next(new AppError("Please provide all required fields.", 400));

    await removeTracksFromPlaylist(id, tracks);

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
