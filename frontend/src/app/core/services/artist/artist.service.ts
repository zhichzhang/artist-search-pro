import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ArtistInfo} from '../../../models/artist-info.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private url: string = environment.apiUrl + '/artists';

  constructor() { }
}
