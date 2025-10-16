import mongoose from "mongoose";
import PlaylistType from "../../enums/playlistTypes";

const PlaylistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: null },
    type: {
      type: String,
      enum: Object.values(PlaylistType),
      default: PlaylistType.CUSTOM,
    },
    tracks: [{ type: mongoose.Types.ObjectId, ref: "Track" }],
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true },
);

PlaylistSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

PlaylistSchema.set("toJSON", { virtuals: true });
PlaylistSchema.set("toObject", { virtuals: true });

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
