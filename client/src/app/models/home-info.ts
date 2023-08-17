import { Artist } from "./artist";
import { Playlist } from "./playlist";
import { Song } from "./song";

export interface HomeInfo {
    topSongs : Array<Song>
    recommendedSongs : Array<Song>
    topArtists : Array<Artist>
    playlists : Array<Playlist>
}
