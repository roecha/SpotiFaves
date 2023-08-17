const { v4: uuidv4 } = require("uuid");
// let User = require("../models/user.js");

class Playlist {
    constructor(id, name, songs) {
        this.id = id;
        this.name = name;
        this.songs = songs;
    }
}

// const mongoose = require("mongoose");

// const playlistSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     songs: [String],
//     // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// });

// module.exports = mongoose.model("Playlist", playlistSchema);

// Create a new playlist
// Playlist.createPlaylist = async (username) => {
//     const user = await User.getUserByUsername(username);
//         if (!user) {
//             throw new Error("User not found");
//         }

//         let playlistNum = Object.keys(user.playlists).length + 1;
//         // Create a new playlist and link it to the user
//         const playlist = new Playlist(uuidv4(), `Playlist #${playlistNum}`, []);

//         if (user.playlists)
//             user.playlists[playlist.id] = {id: playlist.id, name: playlist.name, songs: playlist.songs};
//         else {
//             let list = {}
//             list[playlist.id] = {id: playlist.id, name: playlist.name, songs: playlist.songs};
//             user.playlists = list;
//         }

//         await User.updateUserByUsername(username, user);

//         return playlist;
// };


module.exports = Playlist;
