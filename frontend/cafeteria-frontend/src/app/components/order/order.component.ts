// order.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { PurchaseService } from '../../services/purchase.service';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface Category {
  name: string;
  description: string;
  products: Product[];
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }
  
  groupByCategory(products: Product[]): Category[] {
    const categoryMap = new Map<string, Category>();

    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          name: product.category,
          description: '',
          products: []
        });
      }
      categoryMap.get(product.category)!.products.push(product);
    });

    return Array.from(categoryMap.values());
  }

  addToCart(product: Product): void {
  
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    
    this.purchaseService.addToCart(cartItem);
  }

}