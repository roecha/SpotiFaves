import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicInfoService } from './../../services/music-info.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    constructor(private MusicInfoService : MusicInfoService,
    private route : ActivatedRoute,
    private router : Router) { }

    
      
    spotifyAuth() {
      var client_id = "75aed4d592b84a93b9e2f26cfa6ea3bc";
      /*UPDATE THIS*/
      var redirect_uri = "http://localhost:4200/home";
      var scope = "user-read-private user-read-email user-top-read playlist-modify-private";
      var state = this.generateRandomString(16);

      var query ="https://accounts.spotify.com/authorize";
      query += "?client_id=" + client_id;
      query += "&state=" + state;
      query += "&response_type=code";
      query += "&redirect_uri=" + redirect_uri;
      query += "&show_dialog=true"
      query += "&scope=" + scope;

      console.log(query);
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
