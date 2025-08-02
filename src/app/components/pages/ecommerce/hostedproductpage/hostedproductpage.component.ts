import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CustomizerSettingsService } from 'src/app/components/customizer-settings/customizer-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hostedproductpage',
  templateUrl: './hostedproductpage.component.html',
  styleUrls: ['./hostedproductpage.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatTooltipModule, CarouselModule, CommonModule, FormsModule]
})
export class HostedProductPageComponent implements OnInit {
  itemDetails: any;
  isLoading = true;
  error: string | null = null;
  quantity: number = 1;

  vendorId: number | null = null; // ✅ for vendor
  supplierId: number | null = null; // ✅ for supplier
  customerId: number | null = null; // ✅ for customer

  constructor(
    private http: HttpClient,
    private router: Router,
    public themeService: CustomizerSettingsService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.id) {
      // ✅ User is logged in, use user.id from localStorage
      this.customerId = parseInt(user.id, 10);
    } else {
      // ✅ Guest user, set customerId to 0
      this.customerId = 0;
    }
    
    console.log('✅ Login Status:', { isLoggedIn: !!token, customerId: this.customerId, userData: user });

    let payload: any = history.state.payload;

    if (!payload || !payload.itemId) {
      const saved = localStorage.getItem('selectedItem');
      if (saved) {
        payload = JSON.parse(saved);
      }
    }

    console.log('✅ Payload from history or localStorage:', payload);

    if (payload && payload.itemId) {
      // ✅ Set vendorId and supplierId from payload (from SupplierItemDetailsComponent)
      this.vendorId = payload.vendorId ? parseInt(payload.vendorId, 10) : null;
      this.supplierId = payload.supplierId ? parseInt(payload.supplierId, 10) : null;
      console.log('✅ Vendor ID from payload:', this.vendorId);
      console.log('✅ Supplier ID from payload:', this.supplierId);
      this.fetchItemDetails(payload.itemId);
    } else {
      this.error = 'No item ID provided';
      this.isLoading = false;
      console.error('✅ No payload or itemId found');
    }
  }

  fetchItemDetails(itemId: string | number): void {
    const url = 'http://localhost:3030/inventory-microservice/api/v1/supplier/item/view-details';
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http
      .post(url, { itemId: parseInt(itemId + '', 10) }, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.status === 1) {
            this.itemDetails = response.data.item;

            // ✅ Set supplierId from tradeFlowUser
            this.supplierId = this.itemDetails.tradeFlowUser?.id ? parseInt(this.itemDetails.tradeFlowUser.id, 10) : this.supplierId;

            // ✅ Set vendorId to match supplierId (as per SupplierItemDetailsComponent)
            this.vendorId = this.itemDetails.tradeFlowUser?.id ? parseInt(this.itemDetails.tradeFlowUser.id, 10) : this.vendorId;

            console.log('✅ Supplier ID from API:', this.supplierId);
            console.log('✅ Vendor ID :', this.vendorId);
            console.log('✅ Item Details:', this.itemDetails);

            this.isLoading = false;
          } else {
            this.error = response.message || 'Failed to load item details';
            this.isLoading = false;
            console.error('✅ API Response Error:', response.message);
          }
        },
        error: (err) => {
          this.error = 'Error fetching item details. Please check your token or item ID.';
          this.isLoading = false;
          console.error('✅ HTTP Error:', err);
        }
      });
  }

  increaseQuantity(): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.supplierId || !this.vendorId) {
      this.snackBar.open('Supplier or Vendor ID is missing. Please try again.', 'Close', { duration: 3000 });
      console.error('✅ Cannot add to cart: supplierId or vendorId is null', {
        supplierId: this.supplierId,
        vendorId: this.vendorId
      });
      return;
    }

    const selectedVariant = this.itemDetails.itemVariants?.[0] ?? null;

    const cartItem = {
      itemId: this.itemDetails.id,
      customerId: this.customerId, // ✅ 0 for guest, user ID if logged in
      supplierId: this.supplierId,
      vendorId: this.vendorId, 
      name: this.itemDetails.name,
      quantity: this.quantity,
      price: selectedVariant ? selectedVariant.priceAdditional : this.itemDetails.price,
      color: selectedVariant?.color || null,
      size: selectedVariant?.size || null
    };

    console.log('✅ CartItem Payload:', cartItem);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.itemId === cartItem.itemId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += this.quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('✅ Updated Cart:', JSON.parse(localStorage.getItem('cart') || '[]'));

    this.snackBar.open(`${this.itemDetails.name} added to cart!`, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });

    this.quantity = 1;
    this.router.navigate(['/checkout']);
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

  getImageUrl(imagePath: string): string {
    return `http://localhost:3030${imagePath}`;
  }

  getSafeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  getGradientBackground(): string {
    return 'linear-gradient(135deg, #e6e6fa, #f0f8ff)';
  }
}