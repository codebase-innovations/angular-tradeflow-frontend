import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-supplier-item-details',
    templateUrl: './supplier-item-details.component.html',
    styleUrls: ['./supplier-item-details.component.scss'],
    imports: [
        MatCardModule,
        MatTabsModule,
        MatTooltipModule,
        CarouselModule,
        CommonModule,
    ],
    standalone: true,
})
export class SupplierItemDetailsComponent implements OnInit {
    itemDetails: any;
    isLoading = true;
    error: string | null = null;

    // ✅ Hold extracted IDs
    supplierId: number | null = null;
    vendorId: number | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private sanitizer: DomSanitizer,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        let payload: any = history.state.payload;

        if (!payload || !payload.itemId) {
            const saved = localStorage.getItem('selectedItem');
            if (saved) {
                payload = JSON.parse(saved);
            }
        }

        console.log('💡 ItemDetailsComponent payload:', payload);

        if (payload && payload.itemId) {
            this.fetchItemDetails(payload.itemId);
        } else {
            this.error = 'No item ID provided';
            this.isLoading = false;
            console.error('💡 No payload or itemId found');
        }
    }

    fetchItemDetails(itemId: string | number): void {
        const url =
            'http://localhost:3030/inventory-microservice/api/v1/supplier/item/view-details';
        const token = localStorage.getItem('access_token') || '';
        const headers = new HttpHeaders({
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });

        this.http
            .post(url, { itemId: parseInt(itemId + '', 10) }, { headers })
            .subscribe({
                next: (response: any) => {
                    if (response.status === 1) {
                        this.itemDetails = response.data.item;

                        this.supplierId = this.itemDetails.tradeFlowUser?.id
                            ? parseInt(this.itemDetails.tradeFlowUser.id, 10)
                            : null;

                        console.log('✅ Supplier ID:', this.supplierId);

                        console.log('✅ Item Details:', this.itemDetails);

                        this.isLoading = false;
                    } else {
                        this.error =
                            response.message || 'Failed to load item details';
                        this.isLoading = false;
                        console.error(
                            '💡 API Response Error:',
                            response.message
                        );
                    }
                },
                error: (err) => {
                    this.error =
                        'Error fetching item details. Please check your token or item ID.';
                    this.isLoading = false;
                    console.error('💡 HTTP Error:', err);
                },
            });
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
            "<i class='flaticon-chevron'></i>",
        ],
    };

    getImageUrl(imagePath: string): string {
        return `http://localhost:3030${imagePath}`;
    }

    getSafeDescription(description: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(description);
    }

    openHostedProductPageInNewTab(): void {
        if (!this.supplierId ) {
            this.snackBar.open(
                'Supplier or Vendor ID is missing. Please try again.',
                'Close',
                { duration: 3000 }
            );
            console.error(
                '💡 Cannot open hosted product page: supplierId or vendorId is null',
                {
                    supplierId: this.supplierId
                }
            );
            return;
        }

        const payload = {
            itemId: this.itemDetails.id,
            supplierId: this.supplierId, // ✅ Use extracted
        };

        console.log('✅ New Hosted Page Payload:', payload);

        localStorage.setItem('selectedItem', JSON.stringify(payload));

        window.open('/hosted-product-page', '_blank');
    }
}
