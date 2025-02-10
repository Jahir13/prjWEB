import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe(
      () => {
        this.router.navigate(['/menu']);
      },
      (error) => {
        this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
        console.error('Error en el login:', error);
      }
    );
  }
}