import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  badge?: string;
}

interface Collection {
  id: number;
  name: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  heroBanner = {
    title: 'Shop Holiday Gift Guides',
    subtitle: 'Unique, personal gifts for everyone you love',
    ctaLabel: 'Shop Now',
    imageUrl: 'assets/images/hero-holiday.png',
  };

  featuredCollections: Collection[] = [];
  todayDeals: Product[] = [];
  recommendedProducts: Product[] = [];
  trendingCollections: Collection[] = [];

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.featuredCollections = [
      { id: 1, name: 'Family Matching', thumbnailUrl: 'assets/images/col-family.png' },
      { id: 2, name: 'Anime Lovers', thumbnailUrl: 'assets/images/col-anime.png' },
      { id: 3, name: 'Gamers', thumbnailUrl: 'assets/images/col-gamer.png' },
      { id: 4, name: 'Pet Lovers', thumbnailUrl: 'assets/images/col-pet.png' },
    ];

    this.todayDeals = [
      { id: 1, name: 'Custom Printed Hoodie', price: 399000, imageUrl: 'assets/images/pro-hoodie.png', badge: '-40%' },
      { id: 2, name: 'Personalized Mug', price: 129000, imageUrl: 'assets/images/pro-mug.png', badge: 'Today only' },
      { id: 3, name: 'Photo Pillow', price: 259000, imageUrl: 'assets/images/pro-pillow.png' },
      { id: 4, name: 'Graphic T-Shirt', price: 199000, imageUrl: 'assets/images/pro-tee.png' },
    ];

    this.recommendedProducts = this.todayDeals;
    this.trendingCollections = this.featuredCollections;
  }

  trackById(_: number, item: { id: number }) {
    return item.id;
  }
}
