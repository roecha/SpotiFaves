import {Artist} from "./artist"
import {Album} from "./album"

export interface Song {
    id : string,
    name : string,
    artist : Array<Artist>,
    album : Album,
    date : string,
    popularity : string,
    img : string,
    duration : string,
    url : string,
    uri : string,

    // SOME WAY TO PLAY THE SONG
}
