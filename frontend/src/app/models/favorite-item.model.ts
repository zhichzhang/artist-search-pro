export class FavoriteItem {
    // userId: string;
    artistId: string;
    createdAt: string;
    artistName: string;
    birthday: string;
    deathday: string;
    nationality: string;
    artistThumbnailHref: string;

    constructor(
      // userId: string = '',
      artistId: string = '',
      createdAt: string = '',
      artistName: string = '',
      birthday: string = '',
      deathday: string = '',
      nationality: string = '',
      artistThumbnailHref:  string = '/assets/artsy_logo.svg') {
      // this.userId = userId;
      this.artistId = artistId;
      this.createdAt = createdAt;
      this.artistName = artistName;
      this.birthday = birthday;
      this.deathday = deathday;
      this.nationality = nationality;
      this.artistThumbnailHref = artistThumbnailHref;
    }

}
