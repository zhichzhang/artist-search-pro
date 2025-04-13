import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, throwError} from 'rxjs';
import {SearchItem} from '../../../models/search-item.model';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SimilarArtistsResult} from '../../../models/results/similar-artists-result.model';
import {SearchResult} from '../../../models/results/search-result.model';

@Injectable({
  providedIn: 'root'
})

export class SimilarArtistsService {
  private apiUrl = environment.apiUrl + '/artists/similar';

  private similarArtistItemsSubject = new BehaviorSubject<SearchItem[]>(this.restoreSimilarArtistItems());
  similarArtistItems$ = this.similarArtistItemsSubject.asObservable();

  constructor(private http: HttpClient) { }

  setSimilarArtistItems(newSimilarArtistItems: SearchItem[]){
    const oldSimilarArtistItemsJSON = JSON.stringify(this.similarArtistItemsSubject.getValue());
    const newSimilarArtistItemsJSON = JSON.stringify(newSimilarArtistItems);
    if (oldSimilarArtistItemsJSON !== newSimilarArtistItemsJSON){
      localStorage.setItem('similarArtists', newSimilarArtistItemsJSON);  //
      this.similarArtistItemsSubject.next(newSimilarArtistItems);
    }
  }

  restoreSimilarArtistItems(): SearchItem[] {
    const similarArtistItems = localStorage.getItem('similarArtists');
    return similarArtistItems ? JSON.parse(similarArtistItems) : [];
  }

  similarReq(artistId: string){
    const similarUrl = `${this.apiUrl}/${artistId}`;
    return this.http.get<SimilarArtistsResult>(similarUrl).pipe(
      catchError(error => {
        console.error('Similar API error:', error);
        return throwError(() => new Error('Similar request failed'));
      })
    );
  }
}
