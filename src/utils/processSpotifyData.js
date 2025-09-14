function processTrackData(track) {
    return {
        name: track.name,
        duration: track.duration_ms ?? null,
        artists: track.artists.map(processArtistData),
        [track.album_type === "single" ? "thumbnail" : "album"]: track.album_type === "single" ? track.images?.pop() : processAlbumData(track.album),
        id: track.id,
    }
}

function processAlbumData(album) {
    return {
        title: album.name,
        id: album.id,
        artists: album.artists.map(processArtistData),
        release_date: album.release_date,
        thumbnail: album.images[0] || album.thumbnail,
    }
}

function processArtistData(artist) {
    return {
        id: artist.id,
        name: artist.name,
        thumbnail: artist.images?.pop(),
    }
}

export {
    processTrackData,
    processAlbumData,
    processArtistData
}