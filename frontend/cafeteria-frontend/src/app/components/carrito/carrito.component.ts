import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

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

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {
  @Output() cerrar = new EventEmitter<void>();
  mostrar = true;
  cartItems: CartItem[] = [];
  orderOptions: OrderOptions = {};
  errorMessage: string = '';
  private cartSubscription: Subscription;
  private optionsSubscription: Subscription;
  
  constructor(
    public purchaseService: PurchaseService,
    private authService: AuthService
  ) {
    this.cartSubscription = this.purchaseService.getCart()
      .subscribe(items => {
        this.cartItems = items;
      });

    this.optionsSubscription = this.purchaseService.getOrderOptions()
      .subscribe(options => {
        this.orderOptions = options;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
  }

  cerrarCarrito(): void {
    this.mostrar = false;
    setTimeout(() => this.cerrar.emit(), 300);
  }

  removeFromCart(productId: string): void {
    this.purchaseService.removeFromCart(productId);
  }

  updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value);
    if (quantity > 0) {
      this.purchaseService.updateCartQuantity(productId, quantity);
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updatePaymentMethod(method: 'efectivo' | 'tarjeta'): void {
    this.purchaseService.setOrderOptions({ ...this.orderOptions, paymentMethod: method });
    this.errorMessage = '';
  }

  updateServeOption(option: 'mesa' | 'llevar'): void {
    this.purchaseService.setOrderOptions({ ...this.orderOptions, serveOption: option });
    this.errorMessage = '';
  }

  validateOrder(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Debe iniciar sesión para realizar el pedido';
      return false;
    }

    if (this.cartItems.length === 0) {
      this.errorMessage = 'El carrito está vacío';
      return false;
    }

    if (!this.orderOptions.paymentMethod) {
      this.errorMessage = 'Seleccione un método de pago';
      return false;
    }

    if (!this.orderOptions.serveOption) {
      this.errorMessage = 'Seleccione una opción de servicio';
      return false;
    }

    return true;
  }

  realizarPedido(): void {
    if (!this.validateOrder()) {
      return;
    }

    const userId = this.authService.getUserId();
    const purchaseData = {
      userId,
      products: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.getTotalPrice(),
      paymentMethod: this.orderOptions.paymentMethod!,
      serveOption: this.orderOptions.serveOption!,
      status: 'pending' as const
    };
    
    this.purchaseService.createPurchase(purchaseData).subscribe({
      next: (response) => {
        this.purchaseService.clearCart();
        this.cerrarCarrito();
      },
      error: (error) => {
        console.error('Error al procesar el pedido:', error);
        this.errorMessage = 'Error al procesar el pedido. Por favor, intente nuevamente.';
      }
    });
  }
}