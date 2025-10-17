import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Playlist from "../playlist/playlist.mongo.js";
import PlaylistType from "../../enums/playlistTypes.js";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "fullName is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
      select: false,
    },
  },
  { timestamp: true },
);

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.post("save", async function (doc, next) {
  try {
    const defaults = [
      { name: "Favorites", type: PlaylistType.FAVORITE },
      { name: "Recently Played", type: PlaylistType.RECENT },
    ];

    for (const value of defaults) {
      const existing = await Playlist.findOne({
        user: doc._id,
        isFavorite: true,
      });

      if (!existing) {
        await Playlist.create({ user: doc.id, ...value });
      }
    }

    next();
  } catch (err) {
    console.error("Error creating default playlists:", err);
    next(err);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
