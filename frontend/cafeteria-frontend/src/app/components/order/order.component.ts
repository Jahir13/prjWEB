import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  categories: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((categories) => {
      this.categories = categories;
    }, (error) => {
      console.error('Error al obtener los productos:', error);
    });
  }
  
  groupByCategory(products: any[]): any[] {
    const categoryMap = new Map();

    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          name: product.category,
          description: '',
          products: []
        });
      }
      categoryMap.get(product.category).products.push(product);
    });

    return Array.from(categoryMap.values());
  }

}