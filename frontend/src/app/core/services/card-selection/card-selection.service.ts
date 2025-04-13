import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardSelectionService {
  private isCardSelectedSubject = new BehaviorSubject<boolean>(this.restoreIsCardSelected());
  isCardSelected$ = this.isCardSelectedSubject.asObservable();
  private selectedArtistIdSubject = new BehaviorSubject<string>(<string>this.restoreSelectedArtistId());
  selectedArtistId$ = this.selectedArtistIdSubject.asObservable();

  constructor() { }

  setIsCardSelected(newIsCardSelected: boolean){
      localStorage.setItem('isCardSelected', `${newIsCardSelected}`)
      this.isCardSelectedSubject.next(newIsCardSelected);
  }

  setSelectedArtistId(newSelectedArtistId: string){
    localStorage.setItem('selectedArtistId', newSelectedArtistId);
    this.selectedArtistIdSubject.next(newSelectedArtistId);
  }

  restoreIsCardSelected(){
    return localStorage.getItem('isCardSelected') == 'true';
  }

  restoreSelectedArtistId(): string | null{
    return localStorage.getItem('selectedArtistId');
  }
}
