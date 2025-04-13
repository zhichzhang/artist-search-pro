import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchService} from '../../../core/services/search/search.service';
import {SearchResult} from '../../../models/results/search-result.model';
import {SearchItem} from '../../../models/search-item.model';
import {CardSelectionService} from '../../../core/services/card-selection/card-selection.service';

@Component({
  selector: 'app-search-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  standalone: true
})
export class SearchFormComponent {
  q: string = '';
  isLoading: boolean = false;
  searchResult: SearchResult = { message: '', success: false};

  constructor(
    private searchService: SearchService,
    private cardSelectionService: CardSelectionService) { }

  onSearch(){
    if (this.q.length === 0){
      return;
    }

    this.isLoading = true;

    this.searchService.searchReq(this.q).subscribe({
      next: results => {
        this.searchResult = results;
        if (this.searchResult.success){

          console.log(this.searchResult.data?._embedded);
          const searchItems: SearchItem[] = this.searchResult.data?._embedded || [];
          if (searchItems && searchItems.length > 0) {
            this.searchService.setSearchItems(searchItems);
            this.searchService.setHasSearched(true);
            this.searchService.setNoResults(false);
          }else{
            this.searchService.setHasSearched(true);
            this.searchService.setNoResults(true);
          }
        }else{
          console.log(this.searchResult.message);
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

  clearQ(){
    this.cardSelectionService.setIsCardSelected(false);
    this.searchService.setHasSearched(false);
    this.searchService.setNoResults(false);
    this.searchService.setSearchItems([]);
    this.q = '';
  }
}
