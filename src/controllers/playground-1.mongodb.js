// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("musify");

// Create a new document in the collection.
db.getCollection("playlists").insertOne({
  user: {
    $oid: "68f14e66546cba092a5f5e6f",
  },
  name: "favorite",
  description: "favorite",
  image: "1760746958150.jpg",
  playlistType: "favorite",
});
