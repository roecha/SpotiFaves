import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Constants } from '../constants/constants';
import { User } from '../models/user';
import { Song } from '../models/song';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private URL : string = Constants.API_VERSION;
  private user? : User = undefined;
  public userSubject : BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>( undefined );

  constructor( private http : HttpClient ) {     
    this.ngOnInit();
  }

  ngOnInit() {
    this.getAuthenticatedUser().subscribe();
  }
  
  /** Check is user is authenticated */
  isAuthenticated() {
    return this.user != undefined;
  }

  setUser( user : User | undefined  ) : void {
    this.user = user;
    if( this.user ) {
      window.localStorage.setItem( 'user', JSON.stringify( user ) );
    } else {
      window.localStorage.removeItem( 'user' );
    }
    this.userSubject.next( user );
  }

  /** Gets a user */
  fetchUser() : Observable<User> {
      return this.http.get<User>(this.URL + "/who").pipe( tap( user => {
        this.setUser( user );
      }) );
  }

  getAuthenticatedUser() : Observable<User> {
    let txt = window.localStorage.getItem('user');
    if( txt ) {
      let user : User = JSON.parse( txt as string) as User;
      this.setUser( user );
      return of(user);
    } else {
      return this.fetchUser();
    }
  }

  login( username : string, password : string ) : Observable<User> {
    const API = this.URL + "/login";
    let credentials = { username : username, password : password };
    return this.http
      .post<User>( API, credentials )
      .pipe<User>( tap( u => this.setUser( u ) ) );
  }

  logout() {
    const API = this.URL + "/logout";
    return this.http.post<User>( API, {} ).pipe( tap( () => this.setUser( undefined ) ) );
  }

  /** DATABASE MANAGEMENT **/
  createUser(username : string, password : string, isAdmin : Boolean) : Observable<User>{
    const API = this.URL + "/user";
    let userInfo = { username : username, password : password, isAdmin : isAdmin, authKey : "", playlists : {}};
    return this.http.post<User>(API, userInfo);
  }

  getUserList(search : string | undefined) : Observable<Array<User>>{
    let params;
    if (search) {
      params = new HttpParams().set('search', search);
    }
    const API = this.URL + "/userlist";
    return this.http.get<Array<User>>(API, {params});
  }

  deleteUser(username : string) : Observable<User>{
    const API = this.URL + "/user/" + username;
    return this.http.delete<User>(API);
  }

  updateUser(prevUsername : string, username : string, password : string, isAdmin : Boolean) : Observable<User>{
    const API = this.URL + "/user/" + prevUsername;
    let userInfo = { username : username, password : password, isAdmin : isAdmin};
    return this.http.put<User>(API, userInfo)
  }
}