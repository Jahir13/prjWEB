import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  user: any = null;
  purchases: any[] = [];
  errorMessage: string = '';
  credentials = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      },
      (error: any) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    );
  }

  onLogin(credentials: { email: string, password: string }): void {
    this.authService.login(credentials).subscribe(
      () => {
        this.router.navigate(['/profile']);
      },
      (error: any) => {
        this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
        console.error('Error en el login:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  goToMenu(): void {
    this.router.navigate(['/menu']);
  }
  
  goToPurchases(): void {
    this.router.navigate(['/purchases']);
  }
  
}