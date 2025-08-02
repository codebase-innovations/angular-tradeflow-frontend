import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { SuppliersDialogComponent } from './suppliers-dialog/suppliers-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';

interface Supplier {
  id?: number;
  username: string;
  employeeId: string;
  companyId: number;
  userType: { id: number; name: string; description: string };
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNo?: string;
}

interface UsersListResponse {
  status: number;
  message: string | null;
  error: string | null;
  data: {
    users: {
      page: Supplier[];
      totalRows: number;
    };
  };
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
  ],
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  private apiUrl = 'http://localhost:3030/user-microservice/api/v1/users';

  constructor(
    public dialog: MatDialog,
    public themeService: CustomizerSettingsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleRTLEnabledTheme() {
    this.themeService.toggleRTLEnabledTheme();
  }

  openCreateSuppliersDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchSuppliers();
      }
    });
  }

  openEditSupplierDialog(supplier: Supplier, enterAnimationDuration: string, exitAnimationDuration: string): void {
  const dialogRef = this.dialog.open(SuppliersDialogComponent, {
    width: '600px',
    enterAnimationDuration,
    exitAnimationDuration,
    data: { isEdit: true, supplier: supplier } // Pass the entire supplier object
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.fetchSuppliers(); // Refresh the supplier list after edit
    }
  });
}
  

openViewSupplierDialog(supplier: Supplier, enterAnimationDuration: string, exitAnimationDuration: string): void {
  console.log('Opening view for Supplier ID:', supplier.id);
  this.dialog.open(SupplierDetailComponent, {
    width: '600px',
    enterAnimationDuration,
    exitAnimationDuration,
    data: { id: supplier.id }  // ✅ ✅ ✅ Pass only the ID — the detail will be fetched
  });
}

  fetchSuppliers(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found.');
      alert('No authentication token found. Please log in again.');
      return;
    }

    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    const payload = {
      pageNumber: 0,
      pageSize: 10,
      userTypeId: 2,
    };

    this.http
      .post<UsersListResponse>(`${this.apiUrl}/list`, payload, { headers })
      .subscribe({
        next: (response) => {
          if (response.status === 1 && response.data?.users?.page) {
            this.suppliers = response.data.users.page.filter((user) => user.userType.id === 2);
          } else {
            console.warn('Unexpected response format:', response);
            alert('Unexpected response format. Check console for details.');
          }
        },
        error: (err) => {
          console.error('Error fetching suppliers:', err);
          let errorMessage = 'Failed to load suppliers. Please try again.';
          if (err.status === 401) {
            errorMessage = 'Unauthorized: Invalid or expired token. Please log in again.';
          } else if (err.status === 403) {
            errorMessage = 'Forbidden: You lack permission to view suppliers.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          alert(errorMessage);
        },
      });
  }

  updateSupplier(updatedSupplier: Supplier): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found.');
      alert('No authentication token found. Please log in again.');
      return;
    }

    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    if (!updatedSupplier.id) {
      alert('Supplier ID is missing for update.');
      return;
    }

    this.http
      .put(`${this.apiUrl}/update`, updatedSupplier, { headers })
      .subscribe({
        next: () => {
          this.fetchSuppliers();
          alert('Supplier updated successfully.');
        },
        error: (err) => {
          console.error('Error updating supplier:', err);
          let errorMessage = 'Failed to update supplier. Please try again.';
          if (err.status === 401) {
            errorMessage = 'Unauthorized: Invalid or expired token. Please log in again.';
          } else if (err.status === 403) {
            errorMessage = 'Forbidden: You lack permission to update suppliers.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          alert(errorMessage);
        },
      });
  }
}