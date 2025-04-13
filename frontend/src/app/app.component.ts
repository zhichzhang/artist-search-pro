import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {CommonModule, NgIf} from '@angular/common';
import {SearchFormComponent} from './components/body/search-form/search-form.component';
import {CardComponent} from './components/body/result-list/card/card.component';
import {ArtistDetailsComponent} from './components/body/artist-details/artist-details.component';
import {ResultListComponent} from './components/body/result-list/result-list.component';
import {SimilarArtistsComponent} from './components/body/similar-artists/similar-artists.component';
import {
  CategoryModalComponent
} from './components/body/artist-details/artworks/category-modal/category-modal.component';
import {FavoritesComponent} from './components/body/favorites/favorites.component';
import {LoginFormComponent} from './components/body/auth/login-form/login-form.component';
// import {RegisterFormComponent} from './components/body/auth/register-form/register-form.component';
import {RegisterFormComponent} from './components/body/auth/register-form/register-form.component';
import {NavigationService} from './core/services/navigation/navigation.service';
import {AuthService} from './core/services/auth/auth.service';
import {ToastComponent} from './components/notification/toast/toast.component';
import {NotificationComponent} from './components/notification/notification.component';
import {NotificationService} from './core/services/notification/notification.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SearchFormComponent, CardComponent, ArtistDetailsComponent, ResultListComponent, SimilarArtistsComponent, CategoryModalComponent, FavoritesComponent, LoginFormComponent, RegisterFormComponent, NgIf, ToastComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'Artist Search';
  currentSection: string = 'search';


  constructor(
    private navigationService: NavigationService,
    private authService: AuthService){
    this.navigationService.currentSection$.subscribe(section => {
      this.currentSection = section;
    });
  }

  ngOnInit(): void {
    this.authService.checkIfLoggedIn();
  }


  protected readonly HeaderComponent = HeaderComponent;
}
