import express from "express";
import {
  handleGetAlbumTracks,
  handleGetArtistAlbums,
  handleGetArtistTracks,
  handleGetNewSingles,
  handleGetPopularTracks,
  handleSearch,
  handleStream,
} from "../controllers/music.controller.js";

const musicRouter = express.Router();

musicRouter.post("/search", handleSearch);
musicRouter.get("/albums/:id/tracks", handleGetAlbumTracks);
musicRouter.get("/artist/:id/albums", handleGetArtistAlbums);
musicRouter.get("/artist/:id/tracks", handleGetArtistTracks);
musicRouter.get("/stream/", handleStream);
musicRouter.get("/new-singles/", handleGetNewSingles);
musicRouter.get("/popular-songs/", handleGetPopularTracks);

export default musicRouter;
