import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  @Output() cerrar = new EventEmitter<void>();
  mostrar = true;  // Hace que el carrito esté visible

  cerrarCarrito() {
    this.mostrar = false;
    setTimeout(() => this.cerrar.emit(), 300); // Espera la animación antes de cerrar
  }
}
