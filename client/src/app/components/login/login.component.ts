import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @Input() username? : string;
  @Input() password? : string;
  reload : boolean = true;

  isError : boolean = false;
  constructor( private router : Router, private authService : AuthService ) { }

  ngOnInit() {
    
  }
  
  login() {
    if( this.username && this.password ) {
      this.authService.login(this.username, this.password).subscribe( () => {
        this.isError = false;
        this.username = '';
        this.password = '';
        this.router.navigateByUrl( 'auth' );
      }, error =>{
        this.isError = true;
      } );
    }
  }

}
