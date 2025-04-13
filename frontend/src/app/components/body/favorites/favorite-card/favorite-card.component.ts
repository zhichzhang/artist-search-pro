import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';
import {FavoriteItem} from '../../../../models/favorite-item.model';
import {UserService} from '../../../../core/services/user/user.service';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {NavigationService} from '../../../../core/services/navigation/navigation.service';
import {ArtistDetailsService} from '../../../../core/services/artist-details/artist-details.service';
import {forkJoin} from 'rxjs';
import {ArtistInfo} from '../../../../models/artist-info.model';
import {SimilarArtistsService} from '../../../../core/services/similar-artists/similar-artists.service';
import {CardSelectionService} from '../../../../core/services/card-selection/card-selection.service';

@Component({
  selector: 'app-favorite-card',
  imports: [
    NgStyle
  ],
  templateUrl: './favorite-card.component.html',
  styleUrl: './favorite-card.component.css'
})
export class FavoriteCardComponent {
  @Input() favoriteItem: FavoriteItem = new FavoriteItem();

  interactiveTimer: string = '';
  private intervalId: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private artistDetailsService: ArtistDetailsService,
    private similarArtistsService: SimilarArtistsService,
    private cardSelectionService: CardSelectionService) {
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.updateInteractiveTimer();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateInteractiveTimer() {
    const createdAt = new Date(this.favoriteItem.createdAt);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000);
    console.log(`${this.favoriteItem.artistName}, ${this.favoriteItem.createdAt}, ${diffInSeconds}`);
    this.interactiveTimer = this.formatTime(diffInSeconds);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    } else if (0 < minutes && minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (0 < hours && hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (0 < days && days < 30) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (0 < months && months < 12) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  }

  removeReq(event: Event){
    event.stopPropagation()
    this.userService.favoritesReq(this.authService.getUserId(), this.favoriteItem.artistId).subscribe(
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

  goToArtistDetailsPage(){
    console.log(`Go to artist details page: ${this.favoriteItem.artistId}`);
    this.cardSelectionService.setIsCardSelected(true);
    this.artistDetailsReq();
    this.navigationService.setSection('search');

  }

  artistDetailsReq() {
    const isLoggedIn = this.authService.getIsLoggedIn();
    const artistId = this.favoriteItem.artistId;
    console.log(`Start requesting the details of the artist with id ${artistId}.`);
    this.artistDetailsService.setIsLoading(true);
    console.log(`this.isLoggedIn: ${isLoggedIn}`);

    if(isLoggedIn){
      forkJoin({
        artistInfoResult: this.artistDetailsService.artistInfoReq(artistId),
        artworksResult: this.artistDetailsService.artworksReq(artistId),
        similarArtistsResult: this.similarArtistsService.similarReq(artistId)
      }).subscribe({
        next: ({ artistInfoResult, artworksResult, similarArtistsResult}) => {
          if (artistInfoResult.success && artistInfoResult.data) {
            console.log('Artist Info:',artistInfoResult.data);
            this.artistDetailsService.setArtistInfo(artistInfoResult.data || new ArtistInfo());
          } else {
            console.log('Artist Info Error:', artistInfoResult.message);
          }

          if (artworksResult.success && artworksResult.data) {
            console.log('Artworks:', artworksResult.data?._embedded);
            this.artistDetailsService.setArtworks(artworksResult.data?._embedded || []);
          } else {
            console.log('Artworks Error:', artworksResult.message);
          }

          if (similarArtistsResult.success && similarArtistsResult.data) {
            console.log('Similar Artists:', similarArtistsResult.data?._embedded);
            this.similarArtistsService.setSimilarArtistItems(similarArtistsResult.data?._embedded || []);
          } else {
            console.log('Artworks Error:', similarArtistsResult.message);
          }
        },
        error: (err) => {
          console.log('Error:', err);
        },
        complete: () => {
          this.artistDetailsService.setIsLoading(false);
          console.log('All three requests completed.');
        }
      });
    } else{
      forkJoin({
        artistInfoResult: this.artistDetailsService.artistInfoReq(artistId),
        artworksResult: this.artistDetailsService.artworksReq(artistId)
      }).subscribe({
        next: ({ artistInfoResult, artworksResult }) => {
          if (artistInfoResult.success && artistInfoResult.data) {
            console.log('Artist Info:',artistInfoResult.data);
            this.artistDetailsService.setArtistInfo(artistInfoResult.data || new ArtistInfo());
          } else {
            console.log('Artist Info Error:', artistInfoResult.message);
          }

          if (artworksResult.success && artworksResult.data) {
            console.log('Artworks:', artworksResult.data._embedded);
            this.artistDetailsService.setArtworks(artworksResult.data._embedded || []);
          } else {
            console.log('Artworks Error:', artworksResult.message);
          }
        },
        error: (err) => {
          console.log('Error:', err);
        },
        complete: () => {
          this.artistDetailsService.setIsLoading(false);
          console.log('Both of requests are completed.');
        }
      });
    }
  }
}
