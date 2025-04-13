import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {ArtistInfo} from '../../../../models/artist-info.model';
import {UserService} from '../../../../core/services/user/user.service';
import {ArtistDetailsService} from '../../../../core/services/artist-details/artist-details.service';
import {CardSelectionService} from '../../../../core/services/card-selection/card-selection.service';

@Component({
  selector: 'app-artist-info',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.css'
})
export class ArtistInfoComponent implements OnInit{
  isLoggedIn: boolean = true;
  isFavorite: boolean = false;
  artistId: string = "";
  @Input() isLoading: boolean = false;
  @Input() artistInfo: ArtistInfo = new ArtistInfo();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cardSelectionService: CardSelectionService,
    private artistDetailsService: ArtistDetailsService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.cardSelectionService.selectedArtistId$.subscribe(artistId => {
      this.artistId = artistId;
    })
    this.userService.userFavoriteItems$.subscribe(userFavoriteItems => {
      this.isFavorite = userFavoriteItems.some(item => item.artistId === this.artistId);
    });
  }

  toggleFavorite(event: Event) {
    event.stopPropagation()
    this.userService.favoritesReq(this.authService.getUserId(), this.artistId).subscribe(
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
