import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  images: string[] = [
    'assets/carrusel.webp',
    'assets/carrusel1.webp',
    'assets/carrusel2.webp',
    'assets/carrusel4.webp',
    'assets/carrusel5.webp',
    'assets/carrusel3.webp',
    'assets/carrusel6.webp',
    'assets/carrusel7.webp',
    'assets/carrusel8.webp'
  ];

  currentIndex = 0;

  constructor() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia la imagen cada 3 segundos
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
