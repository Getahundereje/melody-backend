import express from "express";
import {
  handleAddTracksToPlaylist,
  handleCreatePlaylist,
  handleDeletePlaylist,
  handleGetAllUserPlaylists,
  handleGetDefaultPlaylistTracks,
  handleGetPlaylistTracks,
  handleRemoveTrackFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = express.Router();

playlistRouter.get("/", handleGetAllUserPlaylists);
playlistRouter.post("/", handleCreatePlaylist);
playlistRouter.delete("/:id", handleDeletePlaylist);
playlistRouter.get("/tracks", handleGetPlaylistTracks);
playlistRouter.post("/:id/tracks", handleAddTracksToPlaylist);
playlistRouter.delete("/:id/tracks/:trackId", handleRemoveTrackFromPlaylist);

export default playlistRouter;
