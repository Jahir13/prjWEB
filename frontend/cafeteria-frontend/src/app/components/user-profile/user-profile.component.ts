import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user = { name: 'Usuario', email: 'usuario@example.com' }; // Datos de prueba
  purchases: any[] = [];

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit(): void {
    console.log('Cargando historial de compras...');
    this.purchaseService.getPurchaseHistory().subscribe(
      (data) => {
        console.log('Historial de compras obtenido:', data);
        this.purchases = data;
      },
      (error) => {
        console.error('Error al obtener el historial de compras:', error);
      }
    );
  }
}