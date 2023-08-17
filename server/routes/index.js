var express = require("express");
var dotenv = require('dotenv');
var request = require("request");
var querystring = require("querystring");

var router = express.Router();
dotenv.config();

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var redirectUri = "http://localhost:4200/home";
var stateKey = "spotify_auth_state";

/** Gets the home page */
router.get("/", async function (req, res) {
    const {code: code, state: state, term:term} = req.query;
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

                var options = {
                    url: "https://api.spotify.com/v1/me",
                    headers: { Authorization: "Bearer " + accessToken },
                    json: true,
                };

                // use the access token to access the Spotify Web API 
                request.get(options, async function (error, response, body) {
                    try {
                        // Get the top songs of the user 
                        const result = await getHomeInfo(term);
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
async function getHomeInfo(term) {
    var topSongs = null;
    var recommendedSongs = null;
    var topArtists = null;
    return await getTopFromSpotify(true, term).then((result) => {
        topSongs = makeSongList(result);
        return getTopFromSpotify(false, term).then((result) => {
            topArtists = makeArtistList(result);
            var homeInfo = new HomeInfo(topSongs, recommendedSongs, topArtists);
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

module.exports = router;
