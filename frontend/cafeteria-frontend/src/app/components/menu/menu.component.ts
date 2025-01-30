import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  categories: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.categories = this.groupByCategory(products);
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
          description: '', // Puedes asignar una descripción si la API la proporciona
          products: []
        });
      }
      categoryMap.get(product.category).products.push(product);
    });

    return Array.from(categoryMap.values());
  }
}
