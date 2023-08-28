import { AuthComponent } from './../auth/auth.component';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  username : string = "";
  isLoggedIn : Boolean = false;
  isAdmin : Boolean = false;
  notHome : Boolean = false;

  constructor(private AuthService : AuthService,
  private route : ActivatedRoute,
  private router : Router) { }
  
    ngOnInit() {
      this.AuthService.fetchUser().subscribe(user =>{
        if(user) {
          this.isLoggedIn = true;
        }
        this.isAdmin = user.isAdmin;
        this.username = user.username;
      })
    }

    logout() {
      this.AuthService.logout().subscribe(user =>{
          this.isLoggedIn = false;
          this.isAdmin = false;
          this.username = "";
          this.router.navigate(['/login']);
      })
    }
  

}




