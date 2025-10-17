import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String },
    thumbnail: { type: String },
  },
  { _id: false }
);

const TrackSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    duration: { type: String },
    artists: [ArtistSchema],
    album: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      thumbnail: { type: String, required: true },
      release_date: { type: Date, required: true },
      artists: [ArtistSchema],
    },
    thumbnail: { type: String },
  },
  { timestamps: true, _id: false }
);

TrackSchema.virtual("id").get(function () {
  return this._id;
});

TrackSchema.set("toJSON", { virtuals: true });
TrackSchema.set("toObject", { virtuals: true });

const Track = mongoose.model("Track", TrackSchema);
export default Track;
