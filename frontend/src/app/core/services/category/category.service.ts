import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CategoryResult} from '../../../models/results/category-result.mode';
import {BehaviorSubject, catchError, throwError} from 'rxjs';
import {Category} from '../../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryApiUrl = environment.apiUrl + '/category';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) { }

  setCategories(newCategories: Category[]){
    const oldCategoriesJSON = JSON.stringify(this.categoriesSubject.getValue());
    const newCategoriesJSON = JSON.stringify(newCategories);
    if (newCategoriesJSON !== oldCategoriesJSON) {
      this.categoriesSubject.next(newCategories);
    }
  }

  category(artworkId: string){
    const url = `${this.categoryApiUrl}/${artworkId}`;
    return this.http.get<CategoryResult>(url).pipe(
      catchError(error => {
        console.error('Category API error:', error);
        return throwError(() => new Error('Category request failed'));
      })
    );
  }

}
