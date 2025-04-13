import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import {SearchResult} from '../../../models/results/search-result.model'
import {SearchItem} from '../../../models/search-item.model';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  private apiUrl = environment.apiUrl + '/search';
  private searchItems: SearchItem[] = [];
  defaultThumbnailHref: string = 'assets/artsy_logo.svg';

  private searchItemsSubject = new BehaviorSubject<SearchItem[]>([]);
  searchItems$ = this.searchItemsSubject.asObservable();

  private hasSearchedSubject = new BehaviorSubject<boolean>(false);
  hasSearched$ = this.hasSearchedSubject.asObservable();

  private noResultsSubject = new BehaviorSubject<boolean>(false);
  noResults$ = this.noResultsSubject.asObservable();

  constructor(private http: HttpClient) { }

  searchReq(q: string): Observable<SearchResult> {
    const searchUrl = `${this.apiUrl}/${q}`;
    return this.http.get<SearchResult>(searchUrl).pipe(
      catchError(error => {
        console.error('Search API error:', error);
        return throwError(() => new Error('Search request failed'));
      })
    );
  }

  setSearchItems(newSearchItems: SearchItem[]){
    newSearchItems.forEach((item: SearchItem) => {
      if(item.artistThumbnailHref === '/assets/shared/missing_image.png') item.artistThumbnailHref = this.defaultThumbnailHref;
      item.artistId = item.artistId.trim();
      item.artistName = item.artistName.trim();
    });
    const oldSearchItemsJSON = JSON.stringify(this.searchItemsSubject.getValue());
    const newSearchItemsJSON = JSON.stringify(newSearchItems);
    if (oldSearchItemsJSON !== newSearchItemsJSON) {
      // localStorage.setItem('searchItems', newSearchItemsJSON);
      this.searchItemsSubject.next(newSearchItems);
    }
  }

  setHasSearched(newHasSearched: boolean){
    if (this.hasSearchedSubject.getValue() !== newHasSearched) {
      // localStorage.setItem('hasSearched', `${newHasSearched}`);
      this.hasSearchedSubject.next(newHasSearched);
    }
  }

  setNoResults(newNoResults: boolean){
    if (this.noResultsSubject.getValue() !== newNoResults) {
      // localStorage.setItem('noResults', `${newNoResults}`);
      this.noResultsSubject.next(newNoResults);
    }
  }
}
