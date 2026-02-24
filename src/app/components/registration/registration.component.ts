import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./styles/registration.component.css'],
})
export class RegistrationComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.auth
        .register(
          this.registerForm.value as { email: string; password: string },
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Ошибка регистрации';
            this.isLoading = false;
          },
        });
    }
  }
}
