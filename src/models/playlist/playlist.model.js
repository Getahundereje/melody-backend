import Playlist from "./playlist.mongo.js";
import catchModelAsyncError from "../../utils/catchModelAsyncError.js";
import handleMongooseError from "../../utils/handleMongooseError.js";
import AppError from "../../utils/appError.js";
import { createTrack, trackExists } from "../track/track.model.js";
import { userExists } from "../user/user.model.js";

const trackExistsInAPlaylist = catchModelAsyncError(async (trackId) => {
  return await Playlist.exists({ tracks: trackId });
});

const trackExistsInPlaylist = catchModelAsyncError(
  async (playlistId, trackId) => {
    return await Playlist.exists({ _id: playlistId, tracks: trackId });
  }
);
const playlistExists = catchModelAsyncError(async (playlistId) => {
  return await Playlist.exists({ _id: playlistId });
});

export const createPlaylist = catchModelAsyncError(async (playlistData) => {
  return await Playlist.create(playlistData);
}, handleMongooseError);

export const deletePlaylist = catchModelAsyncError(async (playlistId) => {
  if (!(await playlistExists(playlistId))) {
    throw new AppError("Playlist not found", 404);
  }

  return await Playlist.findByIdAndDelete(playlistId);
}, handleMongooseError);

export const addTracksToPlaylist = catchModelAsyncError(
  async (playlistId, tracks) => {
    if (!(await playlistExists(playlistId))) {
      throw new AppError("Playlist not found", 404);
    }

    for (const track of tracks) {
      if (await trackExists(track.id)) continue;

      await createTrack(track);
    }

    await Promise.all(
      tracks.map(async (track) => {
        if (await trackExists(track.id)) return;

        await createTrack(track);
      })
    );

    const trackIds = tracks.map((track) => track.id);

    return await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: {
          tracks: {
            $each: trackIds,
          },
        },
      },
      { new: true }
    );
  },
  handleMongooseError
);

export const removeTrackFromPlaylist = catchModelAsyncError(
  async (playlistId, trackId) => {
    if (!(await playlistExists(playlistId))) {
      throw new AppError("Playlist not found", 404);
    }

    if (
      !(await trackExists(trackId)) ||
      !(await trackExistsInPlaylist(playlistId, trackId))
    ) {
      throw new AppError("Track not found", 404);
    }

    await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: { tracks: trackId },
      },
      { new: true }
    );

    if (!(await trackExistsInAPlaylist(trackId))) {
      await deleteTrack(trackId);
    }
  },
  handleMongooseError
);

export const getAllUserPlaylists = catchModelAsyncError(async (userId) => {
  return await Playlist.find({ user: userId });
});

export const getPlaylistTracks = catchModelAsyncError(
  async (playlistId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    if (!(await playlistExists(playlistId))) {
      throw new AppError("Playlist not found", 404);
    }

    const playlist = await Playlist.findById(playlistId, { tracks: 1 });

    if (!playlist) return { total: 0, tracks: [] };

    const paginatedPlaylist = await Playlist.findById(playlistId).populate({
      path: "tracks",
      select: "name duration artists thumbnail",
      options: { skip, limit },
    });

    return {
      total: playlist.tracks.length,
      page,
      limit,
      tracks: paginatedPlaylist.tracks,
    };
  },
  handleMongooseError
);

export const getDefaultPlaylistTracks = catchModelAsyncError(
  async (type, userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    if (!(await userExists(type))) {
      throw new AppError("user not found", 404);
    }

    const playlist = await Playlist.findOne(
      { type, user: userId },
      { tracks: 1 }
    );

    if (!playlist) return { total: 0, tracks: [] };

    const paginatedPlaylist = await Playlist.findById(playlist.id).populate({
      path: "tracks",
      select: "name duration artists thumbnail",
      options: { skip, limit },
    });

    return {
      total: playlist.tracks.length,
      page,
      limit,
      tracks: paginatedPlaylist.tracks,
    };
  },
  handleMongooseError
);
