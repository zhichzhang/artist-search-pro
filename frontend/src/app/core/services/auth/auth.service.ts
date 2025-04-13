import { Injectable } from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {LoginResult} from '../../../models/results/login-result.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {User} from '../../../models/user.model';
import {LogoutResult} from '../../../models/results/logout-result.model';
import {RegisterResult} from '../../../models/results/register-result.model';
import {DeletesResult} from '../../../models/results/deletes-result.model';
import {UserService} from '../user/user.service';
import {NotificationService} from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiLoginUrl = environment.apiUrl + '/auth/login';
  private apiRegisterUrl = environment.apiUrl + '/auth/register';
  private apiMeUrl = environment.apiUrl + '/auth/me';
  private apiLogoutUrl = environment.apiUrl + '/auth/logout';
  private apiDeletesUrl = environment.apiUrl + '/user/deletes';

  private isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService) { }


  loginReq(email: string, password: string){
    const url = `${this.apiLoginUrl}/${email}/${password}`;
    return this.http.get<LoginResult>(url, { withCredentials: true }).pipe(
      tap(
        result => {
        if (result.success && result.data) {
          this.setUser(result.data);
          console.log(`Successfully set up \`user\`: ${JSON.stringify(result.data)}`);
          const userId = result.data.userId;
          this.userService.favoriteListReq(userId).subscribe({
            next: (result) => {
              if (result.success && result.data) {
                this.userService.updateUserFavoriteItems(result.data._embedded);
                console.log(`Successfully set up \`userFavoriteItems\`: ${JSON.stringify(result.data._embedded)}`);
              } else {
                this.userService.updateUserFavoriteItems([]);
                console.log(`Successfully set up \`userFavoriteItems\` with some problems： ${JSON.stringify(result.message)}`);
              }
            },
            error: (error) => {
              console.error(`FavoriteList request failed: ${error.message}`);
              this.userService.updateUserFavoriteItems([]);
            },
            complete: () =>{
              // console.log(`AuthService: ${result.message}`);
              this.isLoggedInSubject.next(true);
              console.log(`Successfully logged in: ${result.data}`);
              console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
            }
          });
        } else{
          this.userSubject.next(null);
          this.isLoggedInSubject.next(false);
          console.log(`Failed to log in: ${result.message}`);
          console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
        }
      })
    );
  }

  registerReq(fullName: string, email: string, password: string){
    const url = `${this.apiRegisterUrl}/${fullName}/${email}/${password}`;
    return this.http.get<RegisterResult>(url, { withCredentials: true }).pipe(
      tap (
        result => {
          if (result.success && result.data) {
            // this.setUser(result.data);
            this.setUser(result.data);
            console.log(`Successfully set up \`user\`: ${JSON.stringify(result.data)}`);
            const userId = result.data.userId;
            this.userService.favoriteListReq(result.data.userId).subscribe({
              next: (result) => {
                if (result.success && result.data) {
                  this.userService.updateUserFavoriteItems(result.data._embedded);
                  console.log(`Successfully set up \`userFavoriteItems\`: ${JSON.stringify(result.data._embedded)}`);
                } else {
                  this.userService.updateUserFavoriteItems([]);
                  console.log(`Successfully set up \`userFavoriteItems\` with some problems： ${JSON.stringify(result.message)}`);
                }
              },
              error: (error) => {
                console.error(`FavoriteList request failed: ${error.message}`);
                this.userService.updateUserFavoriteItems([]);
              },
              complete: () =>{
                this.isLoggedInSubject.next(true);
                console.log(`Successfully registered: ${JSON.stringify(result.data)}`);
                console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
              }
            });
          } else {
            this.userSubject.next(null);
            this.isLoggedInSubject.next(false);
            console.log(`Failed to register: ${result.message}`);
            console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
          }
        })
    );
  }

  logoutReq(){
    this.isLoggedInSubject.next(false);
    const url = `${this.apiLogoutUrl}`;
    return this.http.get<LogoutResult>(url, { withCredentials: true }).pipe(
      tap( result =>{
        if (result.success) {
          this.userSubject.next(null);
          this.userService.updateUserFavoriteItems([]);
          this.isLoggedInSubject.next(false);
          this.notificationService.addSuccessMessage("Logged out");
          console.log(`Successfully logged out: ${result.message}`);
          console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
        }else{
          console.log(`Failed to log out: ${result.message}`);
          console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
        }
    }));
  }

  checkIfLoggedIn(){
    return this.meReq().subscribe();
  }


  meReq() {
    const url = `${this.apiMeUrl}`;
    return this.http.get<LoginResult>(url, {withCredentials: true}).pipe(
      tap(
        result => {
          if (result.success && result.data) {
            this.setUser(result.data);
            console.log(`Successfully set up \`user\`: ${JSON.stringify(result.data)}`);
            const userId = result.data.userId;
            this.userService.favoriteListReq(userId).subscribe({
              next: (result) => {
                if (result.success && result.data) {
                  this.userService.updateUserFavoriteItems(result.data._embedded);
                  console.log(`Successfully set up \`userFavoriteItems\`: ${JSON.stringify(result.data._embedded)}`);
                } else {
                  this.userService.updateUserFavoriteItems([]);
                  console.log(`Successfully set up \`userFavoriteItems\` with some problems： ${JSON.stringify(result.message)}`);
                }
              },
              error: (error) => {
                console.error(`FavoriteList request failed: ${error.message}`);
                this.userService.updateUserFavoriteItems([]);
              },
              complete: () => {
                // console.log(`AuthService: ${result.message}`);
                this.isLoggedInSubject.next(true);
                console.log(`Successfully logged in: ${result.data}`);
                console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
              }
            });
          } else {
            this.userSubject.next(null);
            this.isLoggedInSubject.next(false);
            console.log(`Failed to log in: ${result.message}`);
            console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
          }
        })
    );
  }


  deletesReq(userId: string | undefined){
    // Search Service
    // localStorage.removeItem('hasSelected');
    // localStorage.removeItem('searchItems');
    // localStorage.removeItem('noResults');
    // Auth Service
    const deleteApiUrl = `${this.apiDeletesUrl}/${userId}`;
    return this.http.get<DeletesResult>(deleteApiUrl, { withCredentials: true }).pipe(
      tap(result => {
        if (result.success){
          this.userSubject.next(null);
          this.userService.updateUserFavoriteItems([]);
          // localStorage.removeItem('isLoggedIn');
          this.isLoggedInSubject.next(false);
          this.notificationService.addErrorMessage("Account deleted");
          console.log(`Deleted the user with ${userId}.`)
          console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
        }else{
          console.log(`Failed to delete the account: ${result.message}.`);
          console.log(`isLoggedIn: ${this.isLoggedInSubject.getValue()}`);
        }
      })
    );
  }

  setUser(user: User){
    this.userSubject.next(user);
  }

  getUserId(){
    return this.userSubject.getValue()?.userId;
  }

  getUser(){
    return this.userSubject.getValue();
  }

  getIsLoggedIn(){
    return this.isLoggedInSubject.getValue();
  }

  isLoginTokenAvailable(): boolean{
    return !!localStorage.getItem('login_token');
  }

  getAuthHeaders(): HttpHeaders{
    const login_token = localStorage.getItem('login_token');
    return new HttpHeaders({
      Authorization: `Bearer ${login_token}`
    });
  }
}
