import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  products: any[] = [];
  cart: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    console.log('Cargando productos...');
    this.productService.getProducts().subscribe(
      (data) => {
        console.log('Productos obtenidos:', data);
        this.products = data;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  addToCart(product: any): void {
    this.cart.push(product);
    console.log('Producto agregado al carrito:', product);
  }
}