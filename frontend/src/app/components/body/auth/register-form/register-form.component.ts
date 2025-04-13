import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NavigationService} from '../../../../core/services/navigation/navigation.service';
import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {RegisterResult} from '../../../../models/results/register-result.model';

@Component({
  selector: 'app-register-form',
    imports: [
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  isDuplicate: boolean = false;
  isLoading: boolean = false;
  isSubmitted: boolean = false;

  emailRegEx: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  nameRegEx: string = "^[a-zA-Z\\s]+$";

  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private authService: AuthService) {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.pattern(this.nameRegEx)]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegEx)]],
      password: ['', Validators.required]
    });
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.isDuplicate = false;
      this.isSubmitted = false;
    });
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.isDuplicate = false;
      this.isSubmitted = false;
    });
    this.registerForm.get('fullname')?.valueChanges.subscribe(() => {
      this.isDuplicate = false;
      this.isSubmitted = false;
    });
  }

  onFullNameChange(event: Event) {
    const input = (event.target as HTMLInputElement);
    input.value = this.toTitleCase(input.value);
  }

  onFullNameBlur(){
    const fullNameControl = this.registerForm.get('fullname');
    if (fullNameControl?.value) {
      fullNameControl.setValue(fullNameControl.value.trim());
    }
  }


  toTitleCase(val: string){
    return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, fullname, password } = this.registerForm.value;
    console.log(fullname + " " + email + " " + password);

    this.isLoading = true;
    this.register(fullname, email, password);
  }

  register(fullName: string, email: string, password: string) {
    this.authService.registerReq(fullName, email, password).subscribe(
      (result) => {
        if(result.success){
          this.isDuplicate = false;
          this.navigationService.setSection('search');
        } else{
          this.isDuplicate = true;
        }
        console.log(result.message);
        this.isSubmitted = true;
        this.isLoading = false;
      },
      (error) => {
        console.log(error.message);
        this.isDuplicate = true;
        this.isSubmitted = true;
        this.isLoading = false;
      }
    )

  }

  goToLoginSection(){
    this.navigationService.setSection('login');
  }
}
