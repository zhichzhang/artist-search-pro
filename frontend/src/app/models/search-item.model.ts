export class SearchItem {
    artistId: string;
    artistName: string;
    artistThumbnailHref: string;

    constructor(artistId: string = '', artistName: string = '', artistThumbnailHref: string = '/assets/artsy_logo.svg') {
      this.artistId = artistId;
      this.artistName = artistName;
      this.artistThumbnailHref = artistThumbnailHref;
    }
}
