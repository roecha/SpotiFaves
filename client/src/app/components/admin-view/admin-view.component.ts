import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})

export class AdminViewComponent implements OnInit {
  @Input() username? : string;
  @Input() password? : string;
  isAdmin : boolean = false;
  askAgain : boolean = false;
  userList : Array<User> = [];
  user : User | undefined
  userEditing : User | undefined;
  name : string = "";
  queryString : string = "";
  /* 1 = username already taken, 2 = no username, 3 = no password, 4 = no user or password */
  errorNum : number = 0;
    
  constructor( private router : Router, private authService : AuthService ) { }

  ngOnInit() {
    this.authService.getUserList(undefined).subscribe( list => {
      this.userList = list;
    }, error =>{
        this.router.navigate(['/login']);
    });
  }

  counter(i: number) {
    return new Array(i); 
  }

  toggleEdit(userEdit: User) {
  // Toggle the editing state of the user
  if (this.userEditing && this.userEditing !== userEdit) {
    this.userEditing.editing = false;
  }
  userEdit.editing = !userEdit.editing;
  this.userEditing = userEdit;
  if (this.userEditing) {
    this.name = this.userEditing.username;
  }
}

  searchUser() {
    if (this.queryString == "" || !this.queryString) {
      this.authService.getUserList(undefined).subscribe( list => {
        this.userList = list;
      })
    } else {
      this.authService.getUserList(this.queryString).subscribe( list => {
        this.userList = list;
      })
    }
  }

  saveUser(user : User) {    
    this.authService.updateUser(this.name, user.username, user.password, user.isAdmin).subscribe( () => {
      this.authService.getUserList(undefined).subscribe( list => {
        this.userList = list;
      })

    }, error =>{
        this.errorNum = 5;
    });

  }

  deleteUser(user : User) {
    this.askAgain = false;
    this.authService.deleteUser(user.username).subscribe( () => {
      this.authService.getUserList(undefined).subscribe( list => {
        this.userList = list;
      })
    })
  }

  createUser() {
    if( this.username && this.password ) {
        this.authService.createUser(this.username, this.password, this.isAdmin).subscribe( (user) => {
        this.errorNum = 0;
        this.username = '';
        this.password = '';
        this.isAdmin = false;
        this.userList.push(user)
        
      }, error =>{
        this.errorNum = 1;
      });

    } else if(!this.username && !this.password) {
      this.errorNum = 4;
    } else if (!this.password) {
      this.errorNum = 3;
    } else if (!this.username) {
      this.errorNum = 2;
    }
  }  
}

