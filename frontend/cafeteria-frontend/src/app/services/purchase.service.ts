import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3000/purchases';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPurchaseHistory(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  createPurchase(purchase: any): Observable<any> {
    return this.http.post(this.apiUrl, purchase, { headers: this.getHeaders() });
  }

  updatePurchaseStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() });
  }
}