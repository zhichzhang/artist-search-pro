import { Component } from '@angular/core';
import {CategoryModalCardComponent} from './category-modal-card/category-modal-card.component';

@Component({
  selector: 'app-category-modal',
  imports: [
    CategoryModalCardComponent
  ],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent {
  artworkName: string = "Artwork Name";
  artworkYearOfCreation: string = "Artwork Year of Creation";
  artworkThumbnailHref: string = "assets/artsy_logo.svg";

  closeModal(): void {

  }
}
