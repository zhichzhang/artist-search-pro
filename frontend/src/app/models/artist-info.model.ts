export class ArtistInfo {
    name: string;
    birthday: string;
    deathday: string;
    nationality: string;
    biography: string;

    constructor(name: string = '', birthday: string = '', deathday: string = '', nationality: string = '', biography: string = '') {
      this.name = name;
      this.birthday = birthday;
      this.deathday = deathday;
      this.nationality = nationality;
      this.biography = biography;
    }
}
