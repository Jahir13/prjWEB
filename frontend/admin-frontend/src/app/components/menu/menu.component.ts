import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  categories: any[] = [];

  constructor(private productService: ProductService, public dialog: MatDialog, private router: Router) {}

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

  openEditDialog(product: any): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '400px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product._id, result).subscribe(() => {
          this.loadProducts();
        }, (error) => {
          console.error('Error al actualizar el producto:', error);
        });
      }
    });
  }
  
  openAddRecipeDialog(): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '400px',
      data: { name: '', description: '', price: '', category: '', image: '' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe(() => {
          this.loadProducts();
        }, (error) => {
          console.error('Error al agregar el producto:', error);
        });
      }
    });
  }
  
  openDeleteDialog(productId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: '¿Estás seguro de que deseas eliminar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(productId).subscribe(() => {
          this.loadProducts();
        }, (error) => {
          console.error('Error al eliminar el producto:', error);
        });
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
