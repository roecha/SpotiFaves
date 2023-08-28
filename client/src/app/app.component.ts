import { Component, OnInit, OnDestroy } from '@angular/core';
//import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from './services/auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  user? : User;

  isAuthenticated() {
    return this.user != undefined;
  }

  constructor( authService : AuthService ) {
    authService.userSubject.subscribe( (user:User|undefined) => {
      this.user = user;
    } );
  }

  userString() {
    return JSON.stringify( this.user );
  }

  ngOnInit() {    
  }

  ngOnDestroy() {
  }

}