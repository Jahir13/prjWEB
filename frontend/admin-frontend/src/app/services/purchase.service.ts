import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface OrderOptions {
  paymentMethod?: 'efectivo' | 'tarjeta';
  serveOption?: 'mesa' | 'llevar';
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3000/purchases';
  private orderOptionsSubject = new BehaviorSubject<OrderOptions>({});

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPurchaseHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al obtener el historial de compras:', error);
        throw error;
      })
    );
  }

  markPurchaseAsCompleted(purchaseId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${purchaseId}/status`, { status: 'completed' }, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al actualizar el estado de la compra:', error);
        throw error;
      })
    );
  }
  
}
