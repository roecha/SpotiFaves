import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SongViewComponent } from './components/song-view/song-view.component';
import { ArtistViewComponent } from './components/artist-view/artist-view.component';
import { AlbumViewComponent } from './components/album-view/album-view.component';
import { AuthComponent } from './components/auth/auth.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomePageComponent,
    SongViewComponent,
    ArtistViewComponent,
    AlbumViewComponent,
    AuthComponent,
    PlaylistComponent,
    AdminViewComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbDropdownModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
