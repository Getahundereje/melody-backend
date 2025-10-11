import express from "express";
import {
  handleGetAlbumInfo,
  handleGetArtistInfo,
  handleGetNewSingles,
  handleGetPopularTracks,
  handleGetTopArtists,
  handleSearch,
  handleStream,
} from "../controllers/music.controller.js";

const musicRouter = express.Router();

musicRouter.post("/search", handleSearch);
musicRouter.get("/artists/:id", handleGetArtistInfo);
musicRouter.get("/albums/:id", handleGetAlbumInfo);
musicRouter.get("/stream", handleStream);
musicRouter.get("/new-singles/", handleGetNewSingles);
musicRouter.get("/popular-songs/", handleGetPopularTracks);
musicRouter.get("/top-artists/", handleGetTopArtists);

export default musicRouter;
