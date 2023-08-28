import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SongViewComponent } from './components/song-view/song-view.component';
import { AlbumViewComponent } from './components/album-view/album-view.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login-guard.guard';
import { ArtistViewComponent } from './components/artist-view/artist-view.component';
import { AuthComponent } from './components/auth/auth.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { PlaylistComponent } from './components/playlist/playlist.component';

const routes: Routes = [
    { path: 'login', component : LoginComponent, canActivate: [LoginGuard]}, 
    { path: 'auth', component : AuthComponent, canActivate: [AuthGuard]},
    { path: 'song/:sid', component : SongViewComponent },
    { path: 'album/:aid', component : AlbumViewComponent },
    { path: 'artist/:arid', component : ArtistViewComponent },
    { path: 'playlist/:pid', component : PlaylistComponent },
    { path: 'home', component : HomePageComponent, canActivate: [AuthGuard] },
    { path: 'admin', component : AdminViewComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home', pathMatch : 'full'}

];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
