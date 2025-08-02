import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-products-checkout',
    templateUrl: './products-checkout.component.html',
    styleUrls: ['./products-checkout.component.scss'],
    standalone: true,
    imports: [
        MatCardModule,
        MatTabsModule,
        MatTooltipModule,
        CarouselModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
    ],
})
export class ProductsCheckoutComponent implements OnInit {
    cartItems: any[] = [];
    sameAsShipping: boolean = true;

    paymentDetails = {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
    };

    customerDetails = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        townCity: '',
        state: '',
        zipCode: '',
        billingFirstName: '',
        billingLastName: '',
        billingEmail: '',
        billingPhone: '',
        billingAddress: '',
        billingTownCity: '',
        billingState: '',
        billingZipCode: '',
    };

    constructor(
        public themeService: CustomizerSettingsService,
        private http: HttpClient,
        private router: Router
    ) {}

    ngOnInit(): void {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart).map((item: any) => ({
                ...item,
                supplierId:
                    item.supplierId ||
                    parseInt(localStorage.getItem('trade_supplier_id') || '0'),
                vendorId:
                    item.vendorId ||
                    parseInt(localStorage.getItem('trade_vendor_id') || '0'),
                itemId: item.itemId || item.id || 0,
            }));
        } else {
            this.cartItems = [];
        }

        console.log('✅ Cart Items:', this.cartItems);
    }

    getSubTotal(): number {
        return this.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }

    getTotal(): number {
        return this.getSubTotal() + 15.99;
    }

    proceedToShipping(): void {
        if (
            !this.customerDetails.firstName ||
            !this.customerDetails.lastName ||
            !this.customerDetails.email ||
            !this.customerDetails.phone ||
            !this.customerDetails.address ||
            !this.customerDetails.townCity ||
            !this.customerDetails.state ||
            !this.customerDetails.zipCode ||
            !this.paymentDetails.cardNumber ||
            !this.paymentDetails.expiryDate ||
            !this.paymentDetails.cvv ||
            !this.paymentDetails.cardholderName
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const token = localStorage.getItem('access_token') || '';
        const customerId =
            parseInt(localStorage.getItem('trade_customer_id') || '0') || 0;

        // ✅ Safe supplier/vendor IDs — fallback to each item, fallback to storage
        // ✅ Use first item’s supplierId and vendorId for consistency
        const supplierId = this.cartItems[0].supplierId;
        const vendorId = this.cartItems[0].vendorId;

        console.log('✅ Order SupplierID:', supplierId);
        console.log('✅ Order VendorID:', vendorId);
        console.log('✅ CustomerID:', customerId);

        const payload = {
            customerId: customerId,
            supplierId: supplierId,
            vendorId: vendorId,
            items: this.cartItems.map((item) => ({
                itemId: item.itemId || 0,
                quantity: item.quantity,
                price: item.price,
                supplierId: item.supplierId || supplierId,
                vendorId: item.vendorId || vendorId,
            })),
            totalPrice: this.getTotal(),
            shippingAddress: this.customerDetails,
            billingAddress: this.sameAsShipping
                ? this.customerDetails
                : {
                      firstName: this.customerDetails.billingFirstName,
                      lastName: this.customerDetails.billingLastName,
                      email: this.customerDetails.billingEmail,
                      phone: this.customerDetails.billingPhone,
                      address: this.customerDetails.billingAddress,
                      townCity: this.customerDetails.billingTownCity,
                      state: this.customerDetails.billingState,
                      zipCode: this.customerDetails.billingZipCode,
                  },
            paymentDetails: this.paymentDetails,
        };

        console.log('✅ Final Order Payload:', payload);
        // Save customer details to localStorage for tracking
        const shippingInfo = {
            name: `${this.customerDetails.firstName} ${this.customerDetails.lastName}`,
            email: this.customerDetails.email,
            phone: this.customerDetails.phone,
            address: `${this.customerDetails.address}, ${this.customerDetails.townCity}, ${this.customerDetails.state}, ${this.customerDetails.zipCode}`,
        };
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        // Save cart items for tracking
        localStorage.setItem('orderCart', JSON.stringify(this.cartItems));
        const headers = new HttpHeaders({
            accept: '*/*',
            Authorization: `Bearer ${token}`,
        });

        this.http
            .post(
                'http://localhost:3030/order-processing-microservice/api/v1/orders/create',
                payload,
                { headers }
            )
            .subscribe({
                next: (response: any) => {
                    console.log('✅ Order created:', response);
                    alert('✅ Order Created!');
                    this.router.navigate(['/order-place-modal']);
                    localStorage.removeItem('cart');
                    this.cartItems = [];
                },
                error: (error) => {
                    console.error('❌ Order failed:', error);
                    alert('❌ Order creation failed!');
                },
            });
    }
}
