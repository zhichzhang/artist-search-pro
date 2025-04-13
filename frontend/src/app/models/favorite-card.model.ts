import {ArtistInfo} from './artist-info.model';
import {SearchItem} from './search-item.model';
import {FavoriteItem} from './favorite-item.model';

export class FavoriteCard {
  artistInfo: ArtistInfo;
  searchItem: SearchItem;
  favoriteItem: FavoriteItem;

  constructor(artistInfo: ArtistInfo, searchItem: SearchItem, favoriteItem: FavoriteItem) {
    this.artistInfo = artistInfo;
    this.searchItem = searchItem;
    this.favoriteItem = favoriteItem;
  }
}
