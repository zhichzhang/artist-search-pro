import { Injectable } from '@angular/core';
import {ArtistInfo} from '../../../models/artist-info.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, catchError, throwError} from 'rxjs';
import {ArtistDetails} from '../../../models/artist-details.model';
import {environment} from '../../../../environments/environment';
import {SearchResult} from '../../../models/results/search-result.model';
import {ArtistInfoResult} from '../../../models/results/artist-info-result.model';
import {Artwork} from '../../../models/artwork.model';
import {ArtworksResult} from '../../../models/results/artworks-result.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistDetailsService {
  private artistApiUrl: string = environment.apiUrl + '/artists';
  private artworksApiUrl = environment.apiUrl + '/artworks';

  constructor(private http: HttpClient) { }

  private artistInfoSubject = new BehaviorSubject<ArtistInfo>(this.restoreArtistInfo());
  artistInfo$ = this.artistInfoSubject.asObservable();

  private artworksSubject = new BehaviorSubject<Artwork[]>(this.restoreArtworks());
  artworks$ = this.artworksSubject.asObservable();

  private artistIdSubject = new BehaviorSubject<string>(this.restoreArtistId());
  artistId$ = this.artistIdSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  artistInfoReq(artistId: string){
    const artistInfoUrl = `${this.artistApiUrl}/${artistId}`;
    this.setArtistId(artistId);
    return this.http.get<ArtistInfoResult>(artistInfoUrl).pipe(
      catchError(error => {
        console.error('Artist Info API error:', error);
        return throwError(() => new Error('Artist Info request failed'));
      })
    );
  }

  artworksReq(artistId: string){
    const artworksUrl = `${this.artworksApiUrl}/${artistId}`;

    return this.http.get<ArtworksResult>(artworksUrl).pipe(
      catchError(error => {
        console.error('Artworks API error:', error);
        return throwError(() => new Error('Artworks request failed'));
      })
    );
  }

  private restoreArtistInfo()  {
    const artistInfo = localStorage.getItem('artistInfo');
    return artistInfo ? JSON.parse(artistInfo) : [];
  }

  private restoreArtworks() {
    const artworks = localStorage.getItem('artworks');
    return artworks ? JSON.parse(artworks) : [];
  }

  private restoreArtistId(): string {
    return localStorage.getItem('artistId') || "";
  }


  setArtistInfo(newArtistInfo: ArtistInfo) {
    const oldArtistInfoJSON = JSON.stringify(this.artistInfoSubject.getValue());
    const newArtistInfoJSON = JSON.stringify(newArtistInfo);
    if (oldArtistInfoJSON !== newArtistInfoJSON) {
      localStorage.setItem('artistInfo', newArtistInfoJSON);
      this.artistInfoSubject.next(newArtistInfo);
    }
  }

  setArtistId(newArtistId: string) {
    const oldArtistIdJSON = JSON.stringify(this.artistIdSubject.getValue());
    const newArtistIdJSON = JSON.stringify(newArtistId);
    if (oldArtistIdJSON !== newArtistIdJSON) {
      localStorage.setItem('artistId', newArtistId);
      this.artistIdSubject.next(newArtistId);
    }
  }

  setArtworks(newArtworks: Artwork[]) {
    const oldArtworksJSON = JSON.stringify(this.artworksSubject.getValue());
    const newArtworksJSON = JSON.stringify(newArtworks);
    if (oldArtworksJSON !== newArtworksJSON) {
      localStorage.setItem('artworks', newArtworksJSON);
      this.artworksSubject.next(newArtworks);
    }
  }

  setIsLoading(newIsLoading: boolean) {
    this.isLoadingSubject.next(newIsLoading);
  }
}
