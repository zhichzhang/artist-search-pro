export class Category {
    categoryName: string;
    categoryThumbnailHref: string;

    constructor(categoryName: string = '', categoryThumbnailHref: string = '/assets/artsy_logo.svg') {
      this.categoryName = categoryName;
      this.categoryThumbnailHref = categoryThumbnailHref;
    }
}
