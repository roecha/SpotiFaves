import { Playlist } from 'src/app/models/playlist';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicInfoService } from './../../services/music-info.service';
import { HomeInfo } from 'src/app/models/home-info';
import { Song } from 'src/app/models/song';
import { Artist } from 'src/app/models/artist';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  songView : Boolean = true;
  code : string | null;
  state : string | null;
  tsArray : Array<Song> = [];
  rsArray : Array<Song> = [];
  playlistArray : Array<Playlist> = [];
  artistArray : Array<Artist> = []
  homeInfo : HomeInfo = {topSongs : this.tsArray, recommendedSongs : this.rsArray, topArtists : this.artistArray, playlists : this.playlistArray}
  currentPlaylist : Playlist = {name : "", songs : this.tsArray, id : ""};
  isPlaylists : Boolean = false;

  constructor(private MusicInfoService : MusicInfoService,
    private route : ActivatedRoute,
    private router : Router) { 
      this.code = this.route.snapshot.queryParamMap.get('code');
      this.state = this.route.snapshot.queryParamMap.get('state');
    }

    ngOnInit() {
      this.MusicInfoService.getHomeInfo(this.code, this.state, "short").subscribe(info => {
        this.homeInfo = info;
        if (this.homeInfo.playlists.length > 0) {
          this.isPlaylists = true
        }

        if(this.isPlaylists){
          this.currentPlaylist = this.homeInfo.playlists[0];
        }

        let playlistString = localStorage.getItem("selectedPlaylist");
        if (playlistString)
        this.currentPlaylist = JSON.parse(playlistString);
        this.makeDropdownWork();
      
      }, error =>{
        this.router.navigate(['/auth']);
      });
    }
    
    makeDropdownWork () {
        const index = this.homeInfo.playlists.findIndex(item => item.id === this.currentPlaylist.id);
        this.homeInfo.playlists[index] = this.currentPlaylist;
    }

    /** Sort the lists */
    shortTerm(){
      this.MusicInfoService.getHomeInfo(this.code, this.state, "short").subscribe(info => {
        this.homeInfo = info;
      }, error =>{
        this.router.navigate(['/auth']);
      });
    }

    mediumTerm() {
      this.MusicInfoService.getHomeInfo(this.code, this.state, "medium").subscribe(info => {
        this.homeInfo = info;
      }, error =>{
        this.router.navigate(['/auth']);
      });
    }

    longTerm() {
      this.MusicInfoService.getHomeInfo(this.code, this.state, "long").subscribe(info => {
        this.homeInfo = info;
      }, error =>{
        this.router.navigate(['/auth']);
      });
    }

    convertMilliseconds(duration : string) {
      return this.MusicInfoService.getDurationSeconds(duration);
    }

    // createNewPlaylist() {
    //   this.MusicInfoService.createPlaylist().subscribe(playlist => {
    //     this.router.navigate(['/playlist/' + playlist.id]);
    //   })

    // }

    // editPlaylist(id : string) {
    //   if (this.currentPlaylist.id != "") {
    //     this.MusicInfoService.getPlaylist(this.currentPlaylist.id).subscribe(playlist => {
    //       this.router.navigate(['/playlist/' + playlist.id]);
    //     })
    //   }
    // }

    // onPlaylistSelect() {
    //   localStorage.setItem('selectedPlaylist', JSON.stringify(this.currentPlaylist));
    // }

    // checkPlaylist(name : string) {
    //   const index = this.currentPlaylist.songs.findIndex(item => item.name === name);
    //   if (index == -1) {
    //     return false;
    //   }
    //   return true;
    // }

    // addToPlaylist(song : Song) {
    //   this.currentPlaylist.songs.push(song);
    //   this.MusicInfoService.editPlaylist(this.currentPlaylist).subscribe(playlist =>{
    //     localStorage.setItem('selectedPlaylist', JSON.stringify(playlist));
    //   })
    // }
}
