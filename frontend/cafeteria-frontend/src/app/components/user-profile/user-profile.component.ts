import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  purchases: any[] = [];
  showLogin: boolean = true;
  errorMessage: string = '';
  credentials = { email: '', password: '' };

  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        if (user) {
          this.user = user;
          this.loadPurchaseHistory();
        } else {
          this.user = null;
        }
      },
      (error: any) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    );
  }

  loadPurchaseHistory(): void {
    this.purchaseService.getPurchaseHistory().subscribe(
        (data: any) => {
            this.purchases = data;
        },
        (error: any) => {
            console.error('Error al obtener el historial de compras:', error);
            this.errorMessage = 'No se pudo cargar el historial de compras. Inténtalo de nuevo más tarde.';
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

  onRegister(user: { name: string, email: string, password: string }): void {
    this.authService.register(user).subscribe(
      () => {
        this.router.navigate(['/profile']);
      },
      (error: any) => {
        this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
        console.error('Error en el registro:', error);
      }
    );
  }

  toggleForm(): void {
    this.showLogin = !this.showLogin;
    this.errorMessage = '';
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}