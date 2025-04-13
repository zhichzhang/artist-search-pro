import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {NavigationService} from '../../../../core/services/navigation/navigation.service';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;

  isAuthorized: boolean = false;
  isLoading: boolean = false;
  isSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private authService: AuthService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.isAuthorized = false;
      this.isSubmitted = false;
    });
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.isAuthorized = false;
      this.isSubmitted = false;
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    this.login(email, password);
  }

  login(email: string, password: string) {
    this.authService.loginReq(email, password).subscribe(
      result => {
        this.isSubmitted = true;
        if (result.success){
          this.isAuthorized = true;
          this.navigationService.setSection('search');
        } else {
          console.log(result.message);
          this.isAuthorized = false;
        }
        this.isLoading = false;
      },
      error => {
        console.log(error.message);
        this.isSubmitted = true;
        this.isAuthorized = false;
        this.isLoading = false;
      }
    )
  }

  goToRegisterSection() {
    this.navigationService.setSection('register');
  }
}
