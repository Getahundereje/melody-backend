import express from "express";
import {
  handleAddTracksToPlaylist,
  handleCreatePlaylist,
  handleDeletePlaylist,
  handleGetAllUserPlaylists,
  handleGetPlaylistTracks,
  handleRemoveTracksFromPlaylist,
  handleUpdatePlaylist,
} from "../controllers/playlist.controller.js";
import upload from "../config/multer.js";

const playlistRouter = express.Router();

playlistRouter.get("/", handleGetAllUserPlaylists);
playlistRouter.post("/", upload.single("image"), handleCreatePlaylist);
playlistRouter.put("/:id", upload.single("image"), handleUpdatePlaylist);
playlistRouter.delete("/:id", handleDeletePlaylist);
playlistRouter.get("/tracks", handleGetPlaylistTracks);
playlistRouter.post("/:id/tracks", handleAddTracksToPlaylist);
playlistRouter.delete("/:id/tracks", handleRemoveTracksFromPlaylist);

export default playlistRouter;
