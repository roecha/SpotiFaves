import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicInfoService {
  private baseUrl = 'http://localhost:3000';

  constructor( private http : HttpClient ) { }

  getHomeInfo(code: string | null, state: string | null, term: string): Observable<any> {
    let params = new HttpParams();
    if (code)
      params = params.set('code', code);
    if(state)
      params = params.set('state', state);
    params = params.set('term', term);
    return this.http.get(`${this.baseUrl}/`, { params: params, withCredentials: true });
  }

  getSongs(): Observable<any> {
    console.log("hereeeeee")
    return this.http.get(`${this.baseUrl}/songs`);
  }

  getDurationSeconds(duration : string) {
    var milliseconds = Number(duration);
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    var time = minutes + ":" + (milliseconds < 10 ? "0" : "") + seconds
    return time.length == 3 ? time + "0" : time;
}
}


