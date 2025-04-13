import { Component } from '@angular/core';
import {FavoriteCardComponent} from './favorite-card/favorite-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {FavoriteItem} from '../../../models/favorite-item.model';
import {UserService} from '../../../core/services/user/user.service';
import {NoFavoriteArtistsComponent} from './no-favorite-artists/no-favorite-artists.component';

@Component({
  selector: 'app-favorites',
  imports: [
    FavoriteCardComponent,
    NgForOf,
    NoFavoriteArtistsComponent,
    NgIf
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favoriteItems: FavoriteItem[] = [];
  noFavoriteArtists: boolean = true;
  isLoading: boolean = false;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.isFavoritesListLoading$.subscribe(isFavoriteListLoading => this.isLoading = isFavoriteListLoading);
    this.userService.userFavoriteItems$.subscribe((userFavoriteItems: FavoriteItem[]) => {
      this.favoriteItems = userFavoriteItems;
      this.noFavoriteArtists = userFavoriteItems.length === 0;
    })
  }

}
