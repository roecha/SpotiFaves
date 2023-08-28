var express = require("express");
var axios = require("axios");
var dotenv = require("dotenv");

var router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
let app = express();
let User = require("../models/user.js");
let Song = require("../models/song.js");
let Album = require("../models/album.js");
let Artist = require("../models/artist.js");
const Playlist = require("../models/playlist.js");
const HomeInfo = require("../models/home-info.js");
dotenv.config();

/** spotify api info*/
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var accessToken = null;

const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
});

/** Uses my credentials to get song and artist info */
spotifyApi.clientCredentialsGrant()
  .then(({ body }) => {
    const { access_token } = body;
    spotifyApi.setAccessToken(access_token);
    console.log("Received token");
  })
  .catch((err) => {
    console.log("Something went wrong when retrieving an access token", err);
  });

function getUri(playlist) {
    return playlist.songs.map((song) => song.uri);
}

/** Sends an endpoint to the spotify api */
async function fetchWebApi(endpoint, method, body) {
    const result = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method,
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .catch((error) => {
            console.log("Error", error);

            // inspect the error response object to see the error message and status code
            console.log("Error message", error.message);
            console.log("HTTP status code", error.statusCode);
            console.log("Error body", error.body);
        });
    return result;
}

/** ADDS A PLAYLIST TO SPOTIFY */
async function createPlaylistOnSpotify(playlist) {
  try {
    const user = await fetchWebApi('v1/me', 'GET');
    const user_id = user.display_name;
    const tracksUri = getUri(playlist);

    const createdPlaylist = await fetchWebApi(`v1/users/${user_id}/playlists`, 'POST', {
      name: playlist.name,
      description: 'Playlist created by SpotiFaves',
      public: false,
    });

    await fetchWebApi(`v1/playlists/${createdPlaylist.id}/tracks?uris=${tracksUri.join(',')}`, 'POST');
    return createdPlaylist;
  } catch (error) {
    console.error(error);
  }
}

/** Gets the information required to display the home screen */
async function getHomeInfo(term, user) {
    var topSongs = null;
    var recommendedSongs = null;
    var topArtists = null;
    return await getTopFromSpotify(true, term).then((result) => {
        topSongs = makeSongList(result);
        return getTopFromSpotify(false, term).then((result) => {
            topArtists = makeArtistList(result);
            var homeInfo = new HomeInfo(topSongs, recommendedSongs, topArtists, Object.values(user.playlists));
            return homeInfo;
        });
    }).then(result => {return result});
}

/** Get a users top songs and artists */
async function getTopFromSpotify(isSong, term) {
    if (isSong) {
        if (term == "long") {
            return (await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=30", "GET")).items;
        } else if (term == "medium") {
            return (await fetchWebApi("v1/me/top/tracks?time_range=medium_term&limit=30", "GET")).items;
        } else if (term == "short") {
            return (await fetchWebApi("v1/me/top/tracks?time_range=short_term&limit=30", "GET")).items;
        }
    } else {
        if (term == "long") {
            return (await fetchWebApi("v1/me/top/artists?time_range=long_term&limit=20", "GET")).items;
        } else if (term == "medium") {
            return (await fetchWebApi("v1/me/top/artists?time_range=medium_term&limit=20", "GET")).items;
        } else if (term == "short") {
            return (await fetchWebApi("v1/me/top/artists?time_range=short_term&limit=20", "GET")).items;
        }
    }
}

/* Artists top songs */
async function getArtistTopTracks(id) {
    return await fetchWebApi(`v1/artists/${id}/top-tracks?market=US`, "GET").then((result) => {
        return result.tracks;
    });
}

/* Artists albums */
async function getArtistAlbums(id) {
    return await fetchWebApi(`v1/artists/${id}/albums?include_groups=album,single&market=US&limit=20`, "GET").then((result) => { 
        return result.items;
    });
}

function createArtistObject(artist, addSongs) {
    const imgUrl = artist.images ? artist.images[0].url : null;
    /* If we are on the artist page we need the top songs without adding an infinite loop */
    if (addSongs) {
        return getArtistTopTracks(artist.id).then((songs) => {
            var songList = makeSongList(songs, false);
            return getArtistAlbums(artist.id).then(albums => {
                var albumList = makeAlbumList(albums);
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


/** Creates a song model from a song object from spotify */
function createSongObject(song, isSimple) {
    const { id, name, album, popularity, duration_ms, external_urls, uri } =
        song;
    const artists = makeArtistList(song.artists);
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

function createAlbumObject(album, shouldAddSongs) {
    const songs = shouldAddSongs ? makeSongList(album, true) : null;
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
function makeSongList(list, isAlbum) {
    const songList = [];
    // Album objects have different song objects within them
    if (isAlbum) {
        list.tracks.items.forEach((track) =>
            songList.push(createSongObject(track, true))
        );
    } else {
        list.forEach((item) => songList.push(createSongObject(item, false)));
    }
    return songList;
}

/** Create a list of artist objects */
function makeArtistList(list) {
    return list.map((item) => createArtistObject(item, false));
}

/** Create a list of album objects */
function makeAlbumList(list) {
    return list.map((item) => createAlbumObject(item, false));
}

/* Get a song from Spotify */
router.get("/song/:sid", async (req, res, next) => {
  const { sid } = req.params;

  try {
    const data = await spotifyApi.getTrack(sid);
    res.send(createSongObject(data.body));
  } catch (err) {
    console.error(err);
  }
});

/* Get an album from Spotify */
router.get("/album/:aid", async (req, res, next) => {
  const { aid } = req.params;

  try {
    const data = await spotifyApi.getAlbum(aid);
    res.json(createAlbumObject(data.body, true));
  } catch (err) {
    console.error(err);
  }
});

/* Get an artist from Spotify */
router.get("/artist/:arid", async (req, res, next) => {
  const { arid } = req.params;

  try {
    const data = await spotifyApi.getArtist(arid);
    const result = await createArtistObject(data.body, true);
    res.json(result);
  } catch (err) {
    console.error(err);
  }
});


/** Gets the home page */
const redirect_uri = "http://localhost:4200/home";
let previousCode = null;

router.get("/", async (req, res, next) => {
    const { key: code, term: term } = req.query;

    if (code && previousCode !== code) {
        previousCode = code;
        try {
            const { data } = await axios.post(
                "https://accounts.spotify.com/api/token",
                null,
                {
                    params: {
                        grant_type: "authorization_code",
                        code,
                        redirect_uri,
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${Buffer.from(
                            `${client_id}:${client_secret}`
                        ).toString("base64")}`,
                    },
                }
            );

            // console.log(await checkTokenValidity(data.access_token));
            delete req.session.user._id;
            req.session.user.authKey = data.access_token;
            accessToken = data.access_token;
            await User.updateUserByUsername(
                req.session.user.username,
                req.session.user
            );

            const result = await getHomeInfo(term, req.session.user);
            res.json(result);
        } catch (error) {
            next(error);
        }
    } else {
        req.session.user = await User.getUserByUsername(
            req.session.user.username
        );
        const result = await getHomeInfo(term, req.session.user);
        res.json(result);
    }
});

/** Checks if a user is valid */
async function checkTokenValidity(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });
  console.log(response);

  if (response.status === 401) {
    // The access token is not valid or has expired
    return false;
  }

  if (response.status !== 200) {
    throw new Error('Failed to check token validity: ' + response.status);
  }

  return true;
}

/*********  PLAYLIST MANAGEMENT *********/

/** Get a playlist */
router.get("/playlist/:pid", async function (req, res, next){
     try {
         const pid = req.params.pid;
         const user = await User.getUserByUsername(req.session.user.username);
         const playlist = user.playlists[pid];
         res.json(playlist);
     } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
     }
});

/** Create a playlist */
router.post("/playlist", async function (req, res, next){
     try {
        const playlist = await Playlist.createPlaylist(req.session.user.username);
        res.json(playlist);

     } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
     }
});

/** edit a playlist */
router.put("/playlist", async function (req, res, next) {
    try {
        const playlist = req.body.playlist;
        const user = await User.getUserByUsername(req.session.user.username);
        user.playlists[playlist.id] = playlist;
        await User.updateUserByUsername(req.session.user.username, user);
        res.json(playlist);
    } catch (err) {
        res.status(400).json({
             status: 400,
             message: err.message,
        });
    }
});

/** Delete a playlist */
router.delete("/playlist/:pid", async function (req, res, next) {
    try {
        const pid = req.params.pid;
        let user = await User.getUserByUsername(req.session.user.username);
        delete user.playlists[pid];
        await User.updateUserByUsername(req.session.user.username, user);
        res.json(user.playlists[pid]);
        
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

router.post("/addToSpotify", async function (req, res, next) {
    try {
        let playlist = req.body.playlist;
        playlist = await createPlaylistOnSpotify(playlist);
        res.send(playlist);
        
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

module.exports = router;
