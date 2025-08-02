import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-item',
  templateUrl: './supplier-item.component.html',
  styleUrls: ['./supplier-item.component.scss']
})
export class SupplierItemComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'product',
    'category',
    'price',
    'orders',
    'stock',
    'size',
    'colors',
    'rating',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  searchQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly apiBaseUrl = 'http://localhost:3030';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchSupplierItems(1);
  }

  fetchSupplierItems(pageNumber: number = 1) {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    const url = `${this.apiBaseUrl}/inventory-microservice/api/v1/supplier/item/list`;

    const body: any = {
      pageNumber: pageNumber,
      pageSize: 10,
      userTypeId: 2
    };

    if (this.searchQuery) {
      const search = this.searchQuery.trim();
      if (/^\d+$/.test(search) || search.toUpperCase().startsWith('SKU')) {
        body.sku = search;
      } else {
        body.name = search;
      }
    }

    this.http.post<any>(url, body, { headers }).subscribe({
      next: (response) => {
        if (response.status === 1 && response.data?.items?.page) {
          const items = response.data.items.page.map((item: any) => {
            const imagePath = item.itemImages?.[0]?.imagePath;

            return {
              id: item.id,
              // supplierId aur vendorId remove kar diya ✅
              product: {
                productName: item.name || 'Unknown Product',
                productImage: imagePath
                  ? `${this.apiBaseUrl}${imagePath}`
                  : 'assets/img/recent-orders/product1.jpg',
                id: item.id
              },
              category: item.itemCategory?.name || 'Uncategorized',
              price: item.itemVariants?.[0]?.priceAdditional != null
                ? `$${item.itemVariants[0].priceAdditional.toFixed(2)}`
                : 'N/A',
              orders: item.orders || 0,
              stock: item.stock ?? 'N/A',
              size: item.itemVariants?.[0]?.size || 'N/A',
              colors: item.itemVariants || [],
              rating: {
                star: item.rating?.star || '0.0',
                overall: item.rating?.overall || '(0 Votes)'
              },
              action: 'ri-more-fill'
            };
          });

          this.dataSource = new MatTableDataSource(items);
          this.dataSource.paginator = this.paginator;

          if (response.data.items.totalRows) {
            this.paginator.length = response.data.items.totalRows;
          }

          if (items.length === 0) {
            this.snackBar.open('No items found for the given search criteria.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        } else {
          this.snackBar.open('Invalid response from server.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.snackBar.open('Failed to fetch items. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSearch() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.fetchSupplierItems(1);
  }

  // ✅ Sirf itemId bhejna hai
  openViewSupplierItemDetail(element: any): void {
    const payload = {
      itemId: element.id
    };

    console.log('Navigating with Payload:', payload);

    this.router.navigate(['/supplier-item-details'], {
      state: { payload }
    });

    localStorage.setItem('selectedItem', JSON.stringify(payload));
  }

  getColors(colors: any): string[] {
    const colorList: string[] = [];
    if (colors && Array.isArray(colors)) {
      colors.forEach((variant: any) => {
        if (variant.color) {
          colorList.push(variant.color.toLowerCase());
        }
      });
    }
    return colorList.length > 0 ? colorList : ['none'];
  }
}
