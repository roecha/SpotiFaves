import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Album } from 'src/app/models/album';
import { Artist } from 'src/app/models/artist';
import { Song } from 'src/app/models/song';
import { MusicInfoService } from './../../services/music-info.service';


@Component({
  selector: 'app-album-view',
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css']
})
export class AlbumViewComponent {
  songArray : Array<Song> = [];
  artistArray: Array<Artist> = []
  albumArray: Array<Album> = []
  artist : Artist = {id : "", name : "", genres : [], popularity : "", songs : this.songArray, img : "", url : "", albums : this.albumArray}
  album : Album = {name : "", artists : [], genre : [], popularity : "", img : "", id : "", releaseDate : "", url : "", albumType : "", songs : []}
  song : Song = {name : "", id: "", artist : this.artistArray, album : this.album, date : "", popularity : "", img : "", duration : "", url : "", uri : ""};

  constructor(private MusicInfoService : MusicInfoService,
    private route : ActivatedRoute,
    private router : Router) { }
     ngOnInit() {
      this.route.params.subscribe( params => {
        this.album.id = params['aid'];
        this.MusicInfoService.getAlbumInfo(this.album.id).subscribe( album => {
          this.album = album;
        })
      })
     }

     openSpotify() {
      window.open(this.album.url, "_blank");
     }

     convertMilliseconds(duration : string) {
      return this.MusicInfoService.getDurationSeconds(duration);
     }
}
