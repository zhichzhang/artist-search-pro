import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {SearchItem} from '../../../../models/search-item.model';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {CardSelectionService} from '../../../../core/services/card-selection/card-selection.service';
import {UserService} from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage,
    NgClass,
    NgIf
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  defaultThumbnailHref: string = '/assets/artsy_logo.svg';

  @Input() searchItem: SearchItem = {artistId: '', artistName: '', artistThumbnailHref: this.defaultThumbnailHref};
  @Input() isActivated: boolean = false;
  @Output() getArtistDetails = new EventEmitter<string>();

  isFavorite: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private cardSelectionService: CardSelectionService,
    private userService: UserService) {}

  onClick(){
    this.cardSelectionService.setSelectedArtistId(this.searchItem.artistId);
    this.getArtistDetails.emit(this.searchItem.artistId);
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn){
        console.log(`Favorites: ${this.searchItem.artistId}`);
        // this.isFavorite = this.userService.isInFavoriteItems(this.searchItem.artistId);
      }
    })
    this.userService.userFavoriteItems$.subscribe(userFavoriteItems => {
      this.isFavorite = userFavoriteItems.some(item => item.artistId === this.searchItem.artistId);
    });
  }

  toggleFavorite(event: Event) {
    event.stopPropagation()
      this.userService.favoritesReq(this.authService.getUserId(), this.searchItem.artistId).subscribe(
        {
          next: (result) => {
            this.userService.favoriteListReq(this.authService.getUserId()).subscribe({
              next: (result) => {
                if(result.success && result.data) {
                  this.userService.updateUserFavoriteItems(result.data._embedded);
                }
              }
            });
          },
          error: (err) => {
            console.error(`favoritesReq error: ${err.message}`);
          },
          complete: () => {
          }
        }
      );
    }
}
