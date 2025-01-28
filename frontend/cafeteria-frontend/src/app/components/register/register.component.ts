import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: '', email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.register(this.user).subscribe(
      () => {
        this.router.navigate(['/login']); // Redirige al login después del registro
      },
      (error) => {
        this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
        console.error('Error en el registro:', error);
      }
    );
  }
}