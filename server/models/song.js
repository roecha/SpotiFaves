class Song {
    constructor(id, name, artist, album, popularity, img, duration, url, uri) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.popularity = popularity;
        this.img = img;
        this.album = album;
        this.duration = duration;
        this.url = url;
        this.uri = uri;
    }
}


module.exports = Song;

