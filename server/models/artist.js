class Artist {
    constructor(id, name, genres, popularity, img, songs, albums, url) {
        this.id = id;
        this.name = name;
        this.genres = genres;
        this.popularity = popularity;
        this.img = img;
        this.albums = albums;
        this.songs = songs;
        this.url = url;
    }
}


module.exports = Artist;
