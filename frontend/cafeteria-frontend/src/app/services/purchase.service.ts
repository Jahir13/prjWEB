import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderOptions {
  paymentMethod?: 'efectivo' | 'tarjeta';
  serveOption?: 'mesa' | 'llevar';
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3000/purchases';
  private cartItems = new Map<string, CartItem>();
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private orderOptionsSubject = new BehaviorSubject<OrderOptions>({});

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getOrderOptions(): Observable<OrderOptions> {
    return this.orderOptionsSubject.asObservable();
  }

  setOrderOptions(options: OrderOptions): void {
    this.orderOptionsSubject.next({ ...this.orderOptionsSubject.value, ...options });
  }

  addToCart(item: CartItem): void {
    if (this.cartItems.has(item.productId)) {
      const existingItem = this.cartItems.get(item.productId)!;
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.set(item.productId, { ...item });
    }
    this.updateCart();
  }

  removeFromCart(productId: string): void {
    this.cartItems.delete(productId);
    this.updateCart();
  }

  updateCartQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.get(productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  private updateCart(): void {
    this.cartSubject.next(Array.from(this.cartItems.values()));
  }

  clearCart(): void {
    this.cartItems.clear();
    this.updateCart();
    this.orderOptionsSubject.next({});
  }

  getPurchaseHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
        catchError((error) => {
            console.error('Error al obtener el historial de compras:', error);
            throw error;
        })
    );
}

  createPurchase(purchaseData: any): Observable<any> {
    return this.http.post(this.apiUrl, purchaseData, { headers: this.getHeaders() });
  }

  isOrderComplete(): boolean {
    const options = this.orderOptionsSubject.value;
    return this.cartItems.size > 0 && 
           !!options.paymentMethod && 
           !!options.serveOption;
  }
}