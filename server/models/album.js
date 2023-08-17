class Album {
    constructor(id, name, artists, albumType, releaseDate, url, genre, popularity, img, songs) {
        this.id = id;
        this.name = name;
        this.artists = artists;
        this.releaseDate = releaseDate;
        this.url = url;
        this.albumType = albumType;
        this.genre = genre;
        this.popularity = popularity;
        this.img = img;
        this.songs = songs;
    }
}

module.exports = Album;
