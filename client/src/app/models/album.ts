import { Song } from "./song"
import {Artist} from "./artist"

export interface Album {
    id : string,
    name : string,
    artists : Array<Artist>, 
    releaseDate : string,
    url : string,
    albumType : string,
    genre : Array<string>,
    popularity : string,
    img : string
    songs : Array<Song>
}
