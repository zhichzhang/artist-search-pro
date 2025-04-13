import {Component, Input} from '@angular/core';
import {CardComponent} from './card/card.component';
import {SearchItem} from '../../../models/search-item.model';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SearchService} from '../../../core/services/search/search.service';
import {NoResultsComponent} from './no-results/no-results.component';
import {CardSelectionService} from '../../../core/services/card-selection/card-selection.service';
import {ArtistDetailsService} from '../../../core/services/artist-details/artist-details.service';
import {ArtistInfo} from '../../../models/artist-info.model';
import {forkJoin} from 'rxjs';
import {AuthService} from '../../../core/services/auth/auth.service';
import {SimilarArtistsService} from '../../../core/services/similar-artists/similar-artists.service';

@Component({
  selector: 'app-result-list',
  imports: [
    CardComponent,
    NgForOf,
    NgIf,
    NoResultsComponent,
    NgClass
  ],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent {
  artistId: string = '';


  @Input() searchItems: SearchItem[] = [];
  @Input() hasSearched: boolean = false;
  @Input() noResults: boolean = false;

  isLoggedIn: boolean = false;

  activatedCardIndex: number = -1;

  constructor(
    private searchService: SearchService,
    private cardSelectionService: CardSelectionService,
    private artistDetailsService: ArtistDetailsService,
    private authService: AuthService,
    private similarArtistsService: SimilarArtistsService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
    this.searchService.noResults$.subscribe(noResults => {
      this.noResults = noResults;
    })
    this.searchService.searchItems$.subscribe(searchItems => {
      this.activatedCardIndex = -1;
      this.searchItems = searchItems;
    });
    this.searchService.hasSearched$.subscribe(hasSearched => {
      this.hasSearched = hasSearched;
    });
  }

  activateCard(index: number) {
    this.activatedCardIndex = index;
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
