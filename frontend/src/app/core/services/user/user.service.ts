import { Injectable } from '@angular/core';
import {FavoriteItem} from '../../../models/favorite-item.model';
import {User} from '../../../models/user.model';
import {BehaviorSubject, tap} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FavoritesResult} from '../../../models/results/favorites-result.model';
import {FavoriteListResult} from '../../../models/results/favorite-list-result.model';
import {NotificationService} from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  apiFavoritesUrl = environment.apiUrl +'/user/favorites';
  apiFavoriteListUrl = environment.apiUrl +'/user/favorite-list';

  private userSubject = new BehaviorSubject<User>(this.restoreUser());
  user$ = this.userSubject.asObservable();

  private userFavoriteItemsSubject = new BehaviorSubject<FavoriteItem[]>(this.restoreUserFavoriteItems());
  userFavoriteItems$ = this.userFavoriteItemsSubject.asObservable();

  private isFavoritesListLoadingSubject = new BehaviorSubject<boolean>(false);
  isFavoritesListLoading$ = this.isFavoritesListLoadingSubject.asObservable();

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  favoritesReq(userId: string | undefined, artistId: string) {
    const url = `${this.apiFavoritesUrl}/${userId}/${artistId}`;
    console.log(url);
    return this.http.get<FavoritesResult>(url, { withCredentials: true }).pipe(
      tap(favoritesResult => {
        if(favoritesResult.success && favoritesResult.message == "Deleted the user-favorite pair successfully."){
          this.notificationService.addErrorMessage("Removed from favorites");
        }else if(favoritesResult.success && favoritesResult.message == "Saved the user-favorite document successfully."){
          this.notificationService.addSuccessMessage("Added to favorites");
        }
      })
    );
  }

  favoriteListReq(userId: string | undefined) {
    const url = `${this.apiFavoriteListUrl}/${userId}`;
    this.setIsFavoriteListLoading(true);
    return this.http.get<FavoriteListResult>(url, { withCredentials: true }).pipe(
      tap(favoriteListResult => {
        this.setIsFavoriteListLoading(false);
      })
    );
  }

  isInFavoriteItems(artistId: string){
    const designatedFavoriteItemsIndex = this.userFavoriteItemsSubject.getValue().findIndex(item => item.artistId === artistId);
    console.log(designatedFavoriteItemsIndex);
    return designatedFavoriteItemsIndex > -1;
  }

  updateUser(newUser: User) {
    const newUserJSON = JSON.stringify(newUser);
    localStorage.setItem('user', newUserJSON);
    this.userSubject.next(newUser);
  }

  updateUserFavoriteItems(newUserFavoriteItems: FavoriteItem[]) {
    this.userFavoriteItemsSubject.next(newUserFavoriteItems);
  }

  restoreUser(){
    const user = localStorage.getItem('user');
    return user?JSON.parse(user) : new User();
  }

  restoreUserFavoriteItems() {
    const userFavoriteItems = localStorage.getItem('userFavoriteItems');
    return userFavoriteItems? JSON.parse(userFavoriteItems) : [];
  }

  setIsFavoriteListLoading(newIsFavoriteListLoading: boolean) {
    this.isFavoritesListLoadingSubject.next(newIsFavoriteListLoading);
  }


}
