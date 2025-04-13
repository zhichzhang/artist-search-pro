export class Artwork {
    artworkId: string;
    artworkTitle: string;
    artworkDate: string;
    artworkThumbnailHref: string;

    constructor(artworkId: string = '', artworkTitle: string = '', artworkDate: string ='', artworkThumbnailHref: string = '/assets/artsy_logo.svg') {
      this.artworkId = artworkId;
      this.artworkTitle = artworkTitle;
      this.artworkDate = artworkDate;
      this.artworkThumbnailHref = artworkThumbnailHref;
    }
}
