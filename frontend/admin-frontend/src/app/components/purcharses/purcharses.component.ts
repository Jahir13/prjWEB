import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purcharses',
  templateUrl: './purcharses.component.html',
  styleUrls: ['./purcharses.component.css']
})
export class PurcharsesComponent implements OnInit {
  purchases: any[] = [];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.purchaseService.getPurchaseHistory().subscribe(
      (data: any) => {
        this.purchases = data.filter((purchase: any) => purchase.status === 'pending');
      },
      (error: any) => {
        console.error('Error al obtener el historial de compras:', error);
      }
    );
  }  

  markAsCompleted(purchaseId: string): void {
    this.purchaseService.markPurchaseAsCompleted(purchaseId).subscribe(
      () => {
        this.loadPurchases();
      },
      (error) => {
        console.error('Error al marcar como completada:', error);
      }
    );
  }
  
}
