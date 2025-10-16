import Playlist from "./playlist.mongo.js";
import catchModelAsyncError from "../../utils/catchModelAsyncError.js";
import handleMongooseError from "../../utils/handleMongooseError.js";

export const createPlaylist = catchModelAsyncError(async (playlistData) => {
  return await Playlist.create(playlistData);
}, handleMongooseError);

export const addTracksToPlaylist = catchModelAsyncError(
  async (playlistId, tracks) => {
    if (!tracks?.length) return;

    return await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: {
          tracks: {
            $each: tracks,
          },
        },
      },
      { new: true },
    );
  },
  handleMongooseError,
);

export const removeTrackFromPlaylist = catchModelAsyncError(
  async (playlistId, trackId) => {
    return await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: { tracks: { id: trackId } },
      },
      { new: true },
    );
  },
  handleMongooseError,
);

export const getAllUserPlaylists = catchModelAsyncError(async (userId) => {
  return await Playlist.find({ user: userId });
});

export const getPlaylistTracks = catchModelAsyncError(
  async (playlistId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const playlist = await Playlist.findById(playlistId, { tracks: 1 });

    if (!playlist) return { total: 0, tracks: [] };

    const paginatedPlaylist = await Playlist.findById(playlistId).populate({
      path: "tracks",
      select: "name duration artists thumbnail",
      options: { skip, limit },
    });

    return {
      total: playlist.tracks.length,
      tracks: paginatedPlaylist.tracks,
    };
  },
  handleMongooseError,
);

export const getDefaultPlaylistTracks = catchModelAsyncError(
  async (type, userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const playlist = await Playlist.findOne(
      { type, user: userId },
      { tracks: 1 },
    );

    if (!playlist) return { total: 0, tracks: [] };

    const paginatedPlaylist = await Playlist.findById(playlist.id).populate({
      path: "tracks",
      select: "name duration artists thumbnail",
      options: { skip, limit },
    });

    return {
      total: playlist.tracks.length,
      tracks: paginatedPlaylist.tracks,
    };
  },
  handleMongooseError,
);
