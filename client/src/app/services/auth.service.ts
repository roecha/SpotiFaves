import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor( private http : HttpClient ) { }

  getHome(code: string | null, state: string | null): Observable<any> {
    let params = new HttpParams();
    if (code)
      params = params.set('code', code);
    if(state)
      params = params.set('state', state);
    return this.http.get(`${this.baseUrl}/home`, { params: params, withCredentials: true });
  }

  getSongs(): Observable<any> {
    console.log("hereeeeee")
    return this.http.get(`${this.baseUrl}/songs`);
  }
}
