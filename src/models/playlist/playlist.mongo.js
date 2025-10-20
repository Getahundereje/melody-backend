import mongoose from "mongoose";
import PlaylistType from "../../enums/playlistTypes.js";

const PlaylistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, select: false },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: null },
    playlistType: {
      type: String,
      enum: Object.values(PlaylistType),
      default: PlaylistType.CUSTOM,
    },
    tracks: [{ type: String, ref: "Track", select: false }],
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PlaylistSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

PlaylistSchema.virtual("thumbnail").get(function () {
  if (!this.image) return null;

  const host = process.env.HOST || "http://localhost:8000"; 
  return `${host}/uploads/${this.image}`;
});

PlaylistSchema.virtual("type").get(function () {
  return "playlist";
})

PlaylistSchema.set("toJSON", { virtuals: true });
PlaylistSchema.set("toObject", { virtuals: true });

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
