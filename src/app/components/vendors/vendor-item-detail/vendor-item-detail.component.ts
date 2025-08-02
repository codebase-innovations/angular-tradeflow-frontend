import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-item-detail',
  templateUrl: './vendor-item-detail.component.html',
  styleUrls: ['./vendor-item-detail.component.scss'],
  imports: [MatCardModule, MatTabsModule, MatTooltipModule, CarouselModule, CommonModule],
  standalone: true
})
export class VendorItemDetailsComponent implements OnInit {
  itemDetails: any;
  itemImages: any[] = []; // Array to store image paths
  isLoading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id');
      if (itemId) {
        this.fetchItemDetails(itemId);
      } else {
        this.error = 'No item ID provided';
        this.isLoading = false;
      }
    });
  }

  fetchItemDetails(itemId: string): void {
    const url = 'http://localhost:3030/inventory-microservice/api/v1/vendor/item/view-details';
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http
      .post(url, { itemId: parseInt(itemId, 10) }, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.status === 1) {
            this.itemDetails = response.data.item;
            this.itemImages = response.data.item.itemImages || []; // Store images
            this.isLoading = false;
          } else {
            this.error = response.message || 'Failed to load item details';
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.error = 'Error fetching item details. Please check your token or item ID.';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  // Construct full image URL (adjust base URL as needed)
  getImageUrl(imagePath: string): string {
    return `http://localhost:3030${imagePath}`; // Adjust base URL based on your server configuration
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleRTLEnabledTheme(): void {
    this.themeService.toggleRTLEnabledTheme();
  }

  imageSlides: OwlOptions = {
    items: 1,
    nav: true,
    loop: true,
    dots: false,
    autoplay: false,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    navText: [
      "<i class='flaticon-chevron-1'></i>",
      "<i class='flaticon-chevron'></i>"
    ]
  };
}