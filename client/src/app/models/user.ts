import { Playlist } from "./playlist"

export interface User {
    _id : string,
    username : string,
    password : string
    isAdmin : Boolean,
    authKey : String,
    playlists: { [id: string]: Playlist }
    editing : boolean
}
