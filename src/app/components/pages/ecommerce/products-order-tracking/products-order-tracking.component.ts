import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

interface CartItem {
    name: string;
    price: number;
    quantity: number;
    color?: string;
    image?: string;
    itemId: number;
    supplierId: number;
    vendorId: number;
}

interface ShippingInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
}

@Component({
    selector: 'app-products-order-tracking',
    templateUrl: './products-order-tracking.component.html',
    styleUrls: ['./products-order-tracking.component.scss'],
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
    standalone: true,
})
export class ProductsOrderTrackingComponent implements OnInit {
    cartItems: CartItem[] = [];
    shippingInfo: ShippingInfo = { name: '', email: '', phone: '', address: '' };

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadCartItems();
        this.loadShippingInfo();
    }

    loadCartItems(): void {
        const savedCart = localStorage.getItem('orderCart') || localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart).map((item: any) => ({
                ...item,
                supplierId: item.supplierId || parseInt(localStorage.getItem('trade_supplier_id') || '0'),
                vendorId: item.vendorId || parseInt(localStorage.getItem('trade_vendor_id') || '0'),
                itemId: item.itemId || item.id || 0,
            }));
        } else {
            this.cartItems = [];
        }
        console.log('✅ Tracking Cart Items:', this.cartItems);
    }

    loadShippingInfo(): void {
        const savedShipping = localStorage.getItem('shippingInfo');
        if (savedShipping) {
            this.shippingInfo = JSON.parse(savedShipping);
        } else {
            this.shippingInfo = {
                name: 'N/A',
                email: 'N/A',
                phone: 'N/A',
                address: 'N/A',
            };
        }
        console.log('✅ Shipping Info:', this.shippingInfo);
    }

    getSubTotal(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
    }

    getTotal(): number {
        return this.getSubTotal() + 15.99;
    }
}