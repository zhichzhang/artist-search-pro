import { Component } from '@angular/core';
import {CardComponent} from '../result-list/card/card.component';
import {AuthService} from '../../../core/services/auth/auth.service';
import {NgForOf, NgIf} from '@angular/common';
import {CardSelectionService} from '../../../core/services/card-selection/card-selection.service';
import {SimilarArtistsService} from '../../../core/services/similar-artists/similar-artists.service';
import {SearchItem} from '../../../models/search-item.model';
import {forkJoin} from 'rxjs';
import {ArtistInfo} from '../../../models/artist-info.model';
import {ArtistDetailsService} from '../../../core/services/artist-details/artist-details.service';

@Component({
  selector: 'app-similar-artists',
  imports: [
    CardComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './similar-artists.component.html',
  styleUrl: './similar-artists.component.css'
})
export class SimilarArtistsComponent {
  isLoggedIn: boolean = false;
  isCardSelected: boolean = false;
  similarArtistItems: SearchItem[] = [];
  activatedCardIndex: number = -1;
  artistId: string = '';


  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.cardSelectionService.isCardSelected$.subscribe(isCardSelected => {
      this.isCardSelected = isCardSelected;
    });
    this.similarArtistsService.similarArtistItems$.subscribe(similarArtistItems => {
      this.similarArtistItems = similarArtistItems;
    });
  }

  constructor(
    private authService: AuthService,
    private cardSelectionService: CardSelectionService,
    private similarArtistsService: SimilarArtistsService,
    private artistDetailsService: ArtistDetailsService,

    ) {}

  activateCard() {
    // this.activatedCardIndex = index;
    console.log('activateCard');
    this.cardSelectionService.setIsCardSelected(true);
  }

  artistDetailsReq(artistId: string) {
    this.artistId = artistId;

    console.log(`Start requesting the details of the artist with id ${this.artistId}.`);
    this.artistDetailsService.setIsLoading(true);
    console.log(`this.isLoggedIn: ${this.isLoggedIn}`);
    if(this.isLoggedIn){
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
