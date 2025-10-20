import { getTrackPlaylists, isTrackInFavorites } from "../models/playlist/playlist.model.js";

async function processTrackData(track) {
  const album = Object.keys(track.album ?? []).length
    ? processAlbumData(track.album)
    : null;


  return {
    id: track.id,
    name: track.name,
    liked: await isTrackInFavorites(track.id),
    duration: track.duration_ms ?? null,
    artists: track.artists.map(processArtistData),
    album,
    thumbnail: album ? album.thumbnail : (track.images?.[0]?.url ?? null),
    type: "track",
    playlists: await getTrackPlaylists(track.id)
  };
}

function processAlbumData(album) {
  return {
    name: album.name,
    id: album.id,
    artists: album.artists.map(processArtistData),
    release_date: album.release_date,
    thumbnail: album.images?.[0]?.url ?? album.thumbnail?.url ?? null,
    type: "album",
  };
}

function processArtistData(artist) {
  const thumbnail = artist.images?.[artist.images.length - 1]?.url ?? null;

  return {
    id: artist.id,
    name: artist.name,
    thumbnail: thumbnail,
    genres: artist.genres,
    type: "artist",
  };
}

export { processTrackData, processAlbumData, processArtistData };
