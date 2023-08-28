import { Playlist } from 'src/app/models/playlist';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../constants/constants';
import { Observable } from 'rxjs';
import { Song } from '../models/song';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { User } from '../models/user';
import { HomeInfo } from '../models/home-info';
import { observeNotification } from 'rxjs/internal/Notification';


@Injectable({
  providedIn: 'root'
})
export class MusicInfoService {

  private URL : string = Constants.API_VERSION;

  constructor( private http : HttpClient ) {
  }

  
 getDurationSeconds(duration : string) {
    var milliseconds = Number(duration);
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    var time = minutes + ":" + (milliseconds < 10 ? "0" : "") + seconds
    return time.length == 3 ? time + "0" : time;
}

  // ADD ID TO THSI
  getSongInfo(id : string) : Observable<Song> {
    return this.http.get<Song>(this.URL + "/song/" + id)
  } 

  getAlbumInfo(id : string) : Observable<Album> {
    return this.http.get<Album>(this.URL + "/album/" + id)
  } 

  getArtistInfo(id : string) : Observable<Artist> {
    return this.http.get<Artist>(this.URL + "/artist/" + id)
  } 

   getHomeInfo(key: string | null, term : string) : Observable<HomeInfo> {
    let params = new HttpParams();
    if (key) {
      params = params.set('key', key);
    }
    if (term) {
      params = params.set('term', term);
    }
    return this.http.get<HomeInfo>(this.URL, { params: params });
  }

  getPlaylist(pid : string) : Observable<Playlist> {
    return this.http.get<Playlist>(this.URL + "/playlist/" + pid)
  }

  createPlaylist() : Observable<Playlist> {
    return this.http.post<Playlist>(this.URL + "/playlist", null);
  }

  editPlaylist(playlist : Playlist) : Observable<Playlist> {
    let body = {playlist : playlist};
    return this.http.put<Playlist>(this.URL + "/playlist", body);
  }

  deletePlaylist(pid : String) : Observable<Playlist> {
    let url = this.URL + "/playlist/" + pid;
    return this.http.delete<Playlist>(url);
  }

  addToSpotify(playlist : Playlist) : Observable<Playlist> {
    let body = {playlist : playlist};
    return this.http.post<Playlist>(this.URL + "/addToSpotify", body);
  }
 
}

