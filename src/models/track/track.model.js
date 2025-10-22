import AppError from "../../utils/appError.js";
import catchModelAsyncError from "../../utils/catchModelAsyncError.js";
import handleMongooseError from "../../utils/handleMongooseError.js";
import Track from "./track.mongo.js";

export const trackExists = catchModelAsyncError(async (trackId) => {
  return await Track.exists({ _id: trackId });
});

export const createTrack = catchModelAsyncError(async (trackData) => {
  try {
    const track = new Track(trackData);
    track._id = trackData.id;

    return await track.save();
  } catch (error) {
    console.log(error);
  }
}, handleMongooseError);

export const deleteTrack = catchModelAsyncError(async (trackId) => {
  if (!(await trackExists(trackId))) {
    throw new AppError("track not found", 404);
  }

  return await Track.findByIdAndDelete(trackId);
}, handleMongooseError);

export const removePlaylistFromTrack = catchModelAsyncError(async (trackId) => {
  if (!(await trackExists(trackId))) {
    throw new AppError("track not found", 404);
  }

  return await Track.updateMany(
    { _id: { $in: trackIds } },
    { $pull: { playlists: playlistId } }
  );
}, handleMongooseError);
