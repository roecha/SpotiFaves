var express = require("express");
var dotenv = require('dotenv');
var request = require("request");
var querystring = require("querystring");

// let User = require("../models/user.js");
let Song = require("../models/song.js");
let Album = require("../models/album.js");
let Artist = require("../models/artist.js");
let Playlist = require("../models/playlist.js");
let HomeInfo = require("../models/home-info.js");

var router = express.Router();
dotenv.config();

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var redirectUri = "http://localhost:4200/home";
var stateKey = "spotify_auth_state";

/** Gets the home page */
router.get("/", async function (req, res) {
    const {code: code, state: state, term: term} = req.query;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {

        res.status(401).send("state not found");
        return;
    } else {

        const auth = `${clientId}:${clientSecret}`;
        const authHeader = `Basic ${Buffer.from(auth).toString("base64")}`;
        console.log(auth)
        var authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code: code,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            },
            headers: {
                Authorization: authHeader,
            },
            json: true,
        };

        // Call the api to get user access token 
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var accessToken = body.access_token,
                    refreshToken = body.refresh_token;
                    req.session.accessToken = accessToken;

                var options = {
                    url: "https://api.spotify.com/v1/me",
                    headers: { Authorization: "Bearer " + accessToken },
                    json: true,
                };

                // use the access token to access the Spotify Web API 
                request.get(options, async function (error, response, body) {
                    try {
                        // Get the top songs of the user 
                        const result = await getHomeInfo(term, accessToken);
                        res.json(result);
                    } catch (error) {
                        console.error("Error fetching top tracks:", error);
                        res.status(500).send("Error fetching top tracks");
                    }
                });
            } else {
                res.status(400).send({ msg: "invalid user" });
            }
        });
    }
});

router.get("/refresh_token", function (req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization:
                "Basic " +
                new Buffer(client_id + ":" + client_secret).toString("base64"),
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        },
        json: true,
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                access_token: access_token,
            });
        }
    });
});

async function fetchWebApi(endpoint, method, token, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body),
    });
    return await res.json();
}

async function getTopTracks(token) {
    return (
        await fetchWebApi(
            "v1/me/top/tracks?time_range=short_term&limit=10",
            "GET",
            token
        )
    ).items;
}

/** Gets the information required to display the home screen */
async function getHomeInfo(term, token) {
    var topSongs = null;
    var recommendedSongs = null;
    var topArtists = null;
    return await getTopFromSpotify(true, term, token).then((result) => {
        console.log(result)
        topSongs = makeSongList(result);
        return getTopFromSpotify(false, term, token).then((result) => {
            topArtists = makeArtistList(result);
            var homeInfo = new HomeInfo(topSongs, recommendedSongs, topArtists);
            return homeInfo;
        });
    }).then(result => {return result});
}

/** Get a users top songs and artists */
async function getTopFromSpotify(isSong, term, token) {
    if (isSong) {
        if (term == "long") {
            return (await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=30", "GET", token)).items;
        } else if (term == "medium") {
            return (await fetchWebApi("v1/me/top/tracks?time_range=medium_term&limit=30", "GET", token)).items;
        } else if (term == "short") {
            return (await fetchWebApi("v1/me/top/tracks?time_range=short_term&limit=30", "GET", token)).items;
        }
    } else {
        if (term == "long") {
            return (await fetchWebApi("v1/me/top/artists?time_range=long_term&limit=20", "GET", token)).items;
        } else if (term == "medium") {
            return (await fetchWebApi("v1/me/top/artists?time_range=medium_term&limit=20", "GET", token)).items;
        } else if (term == "short") {
            return (await fetchWebApi("v1/me/top/artists?time_range=short_term&limit=20", "GET", token)).items;
        }
    }
} 


/** Creates a song model from a song object from spotify */
function createSongObject(song, isSimple, token) {
    const { id, name, album, popularity, duration_ms, external_urls, uri } =
        song;

        console.log("in here 2")

    const artists = makeArtistList(song.artists, token);
    // isSimple avoids an infinite loop when getting images
    const albumImage = isSimple ? null : album.images[1].url;
    return new Song(
        id,
        name,
        artists,
        album,
        popularity,
        albumImage,
        duration_ms,
        external_urls.spotify,
        uri
    );
}

function createArtistObject(artist, addSongs, token) {
    const imgUrl = artist.images ? artist.images[0].url : null;
    /* If we are on the artist page we need the top songs without adding an infinite loop */
    if (addSongs) {
        return getArtistTopTracks(artist.id, token).then((songs) => {
            var songList = makeSongList(songs, false, token);
            return getArtistAlbums(artist.id, token).then(albums => {
                var albumList = makeAlbumList(albums, token);
                return new Artist(
                    artist.id,
                    artist.name,
                    artist.genres,
                    artist.popularity,
                    imgUrl,
                    songList,
                    albumList,
                    artist.external_urls.spotify
                );
            });
        });
    } else {
        return new Artist(
            artist.id,
            artist.name,
            artist.genres,
            artist.popularity,
            imgUrl,
            null,
            artist.albums,
            artist.external_urls.spotify
        );
    }
}

function createAlbumObject(album, shouldAddSongs, token) {
    const songs = shouldAddSongs ? makeSongList(album, true, token) : null;
    const albumObject = new Album(
        album.id,
        album.name,
        album.artists,
        album.type,
        album.release_date,
        album.external_urls.spotify,
        album.genres,
        album.popularity,
        album.images[1].url,
        songs
    );
    return albumObject;
}

/** Creates a list of song objects */
function makeSongList(list, isAlbum, token) {
    const songList = [];
    // Album objects have different song objects within them
    if (isAlbum) {
        list.tracks.items.forEach((track) =>
            songList.push(createSongObject(track, true, token))
        );
    } else {
        console.log("in here 1")
        console.log(list);
        list.forEach((item) => songList.push(createSongObject(item, false, token)));
    }
    return songList;
}

/** Create a list of artist objects */
function makeArtistList(list, token) {
    return list.map((item) => createArtistObject(item, false, token));
}

/** Create a list of album objects */
function makeAlbumList(list, token) {
    return list.map((item) => createAlbumObject(item, false, token));
}


/* Artists top songs */
async function getArtistTopTracks(id, token) {
    return await fetchWebApi(`v1/artists/${id}/top-tracks?market=US`, "GET", token).then((result) => {
        return result.tracks;
    });
}

/* Artists albums */
async function getArtistAlbums(id, token) {
    return await fetchWebApi(`v1/artists/${id}/albums?include_groups=album,single&market=US&limit=20`, "GET", token).then((result) => { 
        return result.items;
    });
}




module.exports = router;
