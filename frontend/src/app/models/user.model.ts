export class User {
    userId: string;
    fullName: string;
    email: string;
    profileImageUrl: string;

    constructor(userId: string = '', fullName: string = '', email: string = '', profileImageUrl: string = '/assets/artsy_info.svg') {
      this.userId = userId;
      this.fullName = fullName;
      this.email = email;
      this.profileImageUrl = profileImageUrl;
    }
}
