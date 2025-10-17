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
  return await Track.findByIdAndDelete(trackId);
}, handleMongooseError);
