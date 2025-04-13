import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationService} from '../../core/services/navigation/navigation.service';
import {AuthService} from '../../core/services/auth/auth.service';
import {User} from '../../models/user.model';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  currentSection: string = 'search';
  profileImageUrl: string = '/assets/artsy_logo.svg';

  isLoggedIn: boolean = false;

  user: User | null = new User();

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
    this.navigationService.currentSection$.subscribe(currentSection => {
      this.currentSection = currentSection;
    })
  }

  goToSection(section: string) {
    this.currentSection = section;
    this.navigationService.setSection(section);
  }

  logout(){
    this.authService.logoutReq().subscribe(result => {
      if (result.success) {
        this.isLoggedIn = false;
        this.goToSection('search');
      } else{
        console.log(result.message);
      }
    });
  }

  deletes(){
    this.authService.deletesReq(this.user?.userId).subscribe(
      result => {
        if (result.success) {
          this.isLoggedIn = false;
        }else{
          console.log(result.message);
        }
      },
      error => {
        console.log(error.message);
      }
    );
    this.goToSection('search');
  }
}
