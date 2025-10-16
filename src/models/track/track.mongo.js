import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema(
  {
    spotifyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration: { type: String },
    artists: [
      {
        id: { type: String },
        name: { type: String },
        thumbnail: { type: String },
      },
    ],
    album: {
      id: { type: String },
      name: { type: String },
      thumbnail: { type: String },
    },
    thumbnail: { type: String },
  },
  { timestamps: true },
);

TrackSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TrackSchema.set("toJSON", { virtuals: true });
TrackSchema.set("toObject", { virtuals: true });

export default mongoose.model("Track", TrackSchema);
