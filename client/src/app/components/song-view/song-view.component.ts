import { ActivatedRoute, Router } from '@angular/router';
import { MusicInfoService } from './../../services/music-info.service';
import { Component } from '@angular/core';
import { Song } from 'src/app/models/song';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';

@Component({
  selector: 'app-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.css']
})
export class SongViewComponent {
  songArray : Array<Song> = [];
  artistArray: Array<Artist> = []
  albumArray: Array<Album> = []
  artist : Artist = {id : "", name : "", genres : [], popularity : "", songs : this.songArray, img : "", url : "", albums : this.albumArray}
  album : Album = {name : "", artists : [], genre : [], popularity : "", img : "", id : "", releaseDate : "", url : "", albumType : "", songs : this.songArray}
  song : Song = {name : "", id: "", artist : this.artistArray, album : this.album, date : "", popularity : "", img : "", duration : "", url : "", uri : ""};

  constructor(private MusicInfoService : MusicInfoService,
    private route : ActivatedRoute,
    private router : Router) { }

     ngOnInit() {
      this.route.params.subscribe( params => {
        this.song.id = params['sid'];
        this.MusicInfoService.getSongInfo(this.song.id).subscribe( song => {
          this.song = song
        })
      })
     }

     openSpotify() {
      window.open(this.song.url, "_blank");
     }
}
