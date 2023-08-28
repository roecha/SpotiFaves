import { Component } from '@angular/core';

import { MusicInfoService } from './../../services/music-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Playlist } from 'src/app/models/playlist';
import { Song } from 'src/app/models/song';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})

export class PlaylistComponent {
  songArr : Array<Song> = []
  playlist : Playlist = {id : "", name : "", songs : this.songArr}
  editName : Boolean = false; 
  searchText : String = "";
  confirm : boolean = false;
  added : boolean = false;
  queryString : string = "";
  songList : Array<Song> = [];

  constructor(private MusicInfoService : MusicInfoService,
    private route : ActivatedRoute,
    private router : Router) { }
    
     ngOnInit() {
      this.route.params.subscribe(params => {
        this.MusicInfoService.getPlaylist(params['pid']).subscribe(playlist =>{
          this.playlist = playlist;
          this.songList = playlist.songs.slice();
        }, error =>{
        this.router.navigate(['/login']);
        });
      })
     }

     changePlaylistName() {
        this.MusicInfoService.editPlaylist(this.playlist).subscribe(playlist =>{
          localStorage.setItem('selectedPlaylist', JSON.stringify(playlist));
          
        })
        this.editName = false;
     }

     deletePlaylist() {
      this.MusicInfoService.deletePlaylist(this.playlist.id).subscribe(playlist =>{
          localStorage.removeItem('selectedPlaylist');
          this.router.navigate(['/home']);
      })
     }

     addToSpotify() {
      this.MusicInfoService.addToSpotify(this.playlist).subscribe(playlist =>{
          this.added = true;
      })
     }

    searchSong() {
      this.playlist.songs = this.songList.slice();
      this.playlist.songs = this.playlist.songs.filter(song => song.name.toLowerCase().startsWith(this.queryString.toLowerCase()));    
    }

     reorderSongs(event : Event) {

     }

     deleteSong(index : number) {
      if (this.playlist.songs.length != this.songList.length) {
        index = this.songList.findIndex(song => song.name === this.playlist.songs[index].name);
      }

      this.songList.splice(index, 1);
      this.playlist.songs = this.songList.slice()
      this.MusicInfoService.editPlaylist(this.playlist).subscribe(playlist =>{
        localStorage.setItem('selectedPlaylist', JSON.stringify(playlist));
      })
     }
}
