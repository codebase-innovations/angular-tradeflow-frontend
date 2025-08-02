import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-item',
  templateUrl: './vendor-item.component.html',
  styleUrls: ['./vendor-item.component.scss']
})
export class VendorItemComponent implements AfterViewInit {
  displayedColumns: string[] = ['product', 'category', 'price', 'orders', 'stock', 'size', 'colors', 'rating', 'action'];
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
    this.checkAuthAndFetchItems(1);
  }

  private getTokenUserTypeId(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.user_type_id, 10);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry;
    } catch (e) {
      return true;
    }
  }

  private checkAuthAndFetchItems(pageNumber: number) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.snackBar.open('⚠️ No token found. Please log in.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.router.navigate(['/authentication/login']);
      return;
    }

    const userTypeId = this.getTokenUserTypeId(token);
    if (userTypeId !== 1 && userTypeId !== 3) {
      this.snackBar.open('⚠️ Only Admin/Vendor allowed.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.router.navigate(['/authentication/login']);
      return;
    }

    if (this.isTokenExpired(token)) {
      this.snackBar.open('⚠️ Session expired. Please log in again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.router.navigate(['/authentication/login']);
      return;
    }

    this.fetchVendorItems(pageNumber);
  }

  fetchVendorItems(pageNumber: number = 1) {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    const url = `${this.apiBaseUrl}/inventory-microservice/api/v1/vendor/item/list`;

    const body: any = {
      pageNumber: pageNumber,
      pageSize: 10,
      userTypeId: 3
    };

    // ✅ Sirf jab searchQuery diya ho
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const search = this.searchQuery.trim();
      if (/^\d+$/.test(search) || search.toUpperCase().startsWith('SKU')) {
        body.sku = search;
      } else {
        body.name = search;
      }
    }

    console.log('Request Body:', body);

    this.http.post<any>(url, body, { headers }).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response.status === 1 && response.data?.items?.page) {
          const items = response.data.items.page.map((item: any) => {
            const imagePath = item.itemImages?.[0]?.imagePath;
            return {
              id: item.id,
              product: {
                productName: item.name || 'Unknown Product',
                productImage: imagePath ? `${this.apiBaseUrl}${imagePath}` : 'assets/img/recent-orders/product1.jpg',
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
            this.snackBar.open('No vendor items found for your search.', 'Close', {
              duration: 3000, panelClass: ['error-snackbar']
            });
          }
        } else {
          this.snackBar.open('Invalid server response.', 'Close', {
            duration: 3000, panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error:', error);
        let message = 'Failed to fetch vendor items.';
        if (error.status === 401) {
          message = 'Unauthorized. Please log in.';
          this.router.navigate(['/authentication/login']);
        }
        this.snackBar.open(message, 'Close', {
          duration: 3000, panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSearch() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.checkAuthAndFetchItems(1);
  }

  openViewVendorItemDetail(element: any): void {
    console.log('Open Item:', element.id);
    this.router.navigate(['/vendor-item-details', element.id]);
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
