import {ArtistInfo} from './artist-info.model';
import {Artwork} from './artwork.model';

export class ArtistDetails {
  artistInfo: ArtistInfo;
  artworks: Artwork[];

  constructor(newArtistInfo: ArtistInfo, newArtworks: Artwork[] = []) {
    this.artistInfo = newArtistInfo;
    this.artworks = newArtworks;
  }
}
