import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private sectionSubject = new BehaviorSubject<string>(`search`);
  currentSection$ = this.sectionSubject.asObservable();

  setSection(section: string){
    this.sectionSubject.next(section);
  }
  constructor() { }
}
