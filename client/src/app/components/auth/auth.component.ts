import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    constructor(private AuthService : AuthService,
    private route : ActivatedRoute,
    private router : Router,
    private cookieService: CookieService) { }

    
      
    spotifyAuth() {
      var client_id = "a60f72836d8e4dfb8be250a233cf6c71";
      /*UPDATE THIS*/
      var redirect_uri = "http://localhost:4200/home";
      var scope = "user-read-private user-read-email user-top-read";
      var state = this.generateRandomString(16);
      var stateKey = "spotify_auth_state";

      this.cookieService.set(stateKey, state);
      
      var query ="https://accounts.spotify.com/authorize";
      query += "?client_id=" + client_id;
      query += "&state=" + state;
      query += "&response_type=code";
      query += "&redirect_uri=" + redirect_uri;
      query += "&show_dialog=true"
      query += "&scope=" + scope;

      window.location.href = query;
    }

    generateRandomString(length : number) {
      var text = "";
      var possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
}
