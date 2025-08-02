import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { SupplierItemComponent } from './components/suppliers/supplier-item/supplier-item.component';
import { CreateItemComponent } from './components/suppliers/create-item/create-item.component';
import { VendorItemComponent } from './components/vendors/vendor-item/vendor-item.component';
import { SupplierItemDetailsComponent } from './components/suppliers/supplier-item-details/supplier-item-details.component';
import { CreateVendorItemsComponent } from './components/vendors/create-vendor-items/create-vendor-items.component';
import { VendorItemDetailsComponent } from './components/vendors/vendor-item-detail/vendor-item-detail.component';
import { HostedProductPageComponent } from './components/pages/ecommerce/hostedproductpage/hostedproductpage.component';
import { ProductsCartComponent } from './components/pages/ecommerce/products-cart/products-cart.component';
import { ProductsCheckoutComponent } from './components/pages/ecommerce/products-checkout/products-checkout.component';
import { ProductsOrderTrackingComponent } from './components/pages/ecommerce/products-order-tracking/products-order-tracking.component';
import { OrderPlaceModalComponent } from './components/pages/ecommerce/order-place-modal/order-place-modal.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'authentication/login',
        pathMatch: 'full',
    },
    {
        path: 'authentication/login',
        component: LoginComponent,
    },
    {
        path: 'authentication/logout',
        component: LogoutComponent,
    },
    { 
      path: 'hosted-product-page', 
      component: HostedProductPageComponent 
    },
    {
        path: 'order-place-modal', 
        component: OrderPlaceModalComponent,
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'suppliers',
                component: SuppliersComponent,
            },
            {
                path: 'supplieritems',
                component: SupplierItemComponent,
            },
            {
                path: 'createitems',
                component: CreateItemComponent,
            },
            {
                path: 'supplier-item-details',
                component: SupplierItemDetailsComponent,
            },
            {
                path: 'vendors',
                component: VendorsComponent,
            },
            {
                path: 'vendoritems',
                component: VendorItemComponent,
            },
            {
                path: 'create-items',
                component: CreateVendorItemsComponent,
            },
            {
                path: 'vendor-item-details/:id', 
                component: VendorItemDetailsComponent,
            },
            {
                path: 'cart', 
                component: ProductsCartComponent,
            },
            {
                path: 'checkout', 
                component: ProductsCheckoutComponent,
            },
            {
                path: 'product-order-tracking', 
                component: ProductsOrderTrackingComponent,
            },

        ],
    },

    {
        path: '**',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
