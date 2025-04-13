import {Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Artwork} from '../../../../../models/artwork.model';
import {CategoryService} from '../../../../../core/services/category/category.service';
// import {error} from '@angular/compiler-cli/src/transformers/util';
import {CategoryModalCardComponent} from '../category-modal/category-modal-card/category-modal-card.component';
import {Category} from '../../../../../models/category.model';
// import { Modal } from '';

@Component({
  selector: 'app-artwork-card',
  imports: [
    NgIf,
    NgOptimizedImage,
    NgClass,
    CategoryModalCardComponent,
    NgForOf
  ],
  templateUrl: './artwork-card.component.html',
  styleUrl: './artwork-card.component.css'
})

export class ArtworkCardComponent {
  @Input() artwork: Artwork = new Artwork();
  @Output() artworkId: string = "";

  categories: Category[] = [];
  isLoading = false;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {

  }

  onClick(){
    console.log("View the category modal.");
    this.isLoading = true;
    this.categoryService.category(this.artwork.artworkId).subscribe({
      next: results => {
        if(results.success){
          this.categories = results.data?._embedded || [];
          console.log(this.categories);
        }
      },
      error: (err) => {
        console.log('Error:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
