import {Component, Input} from '@angular/core';
import {Category} from '../../../../../../models/category.model';

@Component({
  selector: 'app-category-modal-card',
  imports: [],
  templateUrl: './category-modal-card.component.html',
  styleUrl: './category-modal-card.component.css'
})
export class CategoryModalCardComponent {
  @Input() category: Category = new Category();
}
