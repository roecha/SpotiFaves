import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album';
import { Artist } from 'src/app/models/artist';
import { Song } from 'src/app/models/song';
import { MusicInfoService } from './../../services/music-info.service';



@Component({
  selector: 'app-artist-view',
  templateUrl: './artist-view.component.html',
  styleUrls: ['./artist-view.component.css']
})
export class ArtistViewComponent {
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
        this.artist.id = params['arid'];
        this.MusicInfoService.getArtistInfo(this.artist.id).subscribe( artist => {  
          this.artist = artist;
        })
      })
     }

     formatDate(date : string) {
      return date.substring(5,7) + "-" + date.substring(8,10) + '-' + date.substring(0,4)
    }
    
     openSpotify() {
      window.open(this.artist.url, "_blank");
     }
}
