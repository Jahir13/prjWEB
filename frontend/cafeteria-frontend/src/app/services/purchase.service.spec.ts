import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3000/purchases';

  constructor(private http: HttpClient) { }

  getPurchaseHistory(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createPurchase(purchase: any): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }

  updatePurchaseStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}