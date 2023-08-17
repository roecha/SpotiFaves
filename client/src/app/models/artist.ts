import { Album } from "./album"
import {Song} from "./song"

export interface Artist {
    id: string,
    name : string,
    genres : Array<string>,
    popularity : string,
    songs : Array<Song>
    img : string
    url : string
    albums : Array<Album>
}
