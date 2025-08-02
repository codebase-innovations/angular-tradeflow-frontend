import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { VendorsDialogComponent } from './vendors-dialog/vendors-dialog.component';
import { VendorsDetailsComponent } from './vendors-details/vendors-details.component'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

// Interface aligned with response
interface Vendor {
  id?: number; // Added id for consistency with SuppliersComponent
  username: string;
  employeeId: string;
  companyId: number;
  userType: { id: number; name: string; description: string };
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  mobileNo?: string;
}

interface UsersListResponse {
  status: number;
  message: string | null;
  error: string | null;
  data: {
    users: {
      page: Vendor[];
      totalRows: number;
    };
  };
}

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
  ],
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  private apiUrl = 'http://localhost:3030/user-microservice/api/v1/users'; // Consistent API URL

  constructor(
    public dialog: MatDialog,
    public themeService: CustomizerSettingsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchVendors();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleRTLEnabledTheme() {
    this.themeService.toggleRTLEnabledTheme();
  }

  openCreateVendorsDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(VendorsDialogComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { isEdit: false }, // Added data for consistency with SuppliersComponent
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchVendors(); // Refresh vendors list after creating
      }
    });
  }

  openEditVendorDialog(vendor: Vendor, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(VendorsDialogComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { isEdit: true, userId: vendor.id }, // Pass vendor ID for editing
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateVendor(result); // Update vendor after editing
      }
    });
  }

  openViewVendorDialog(vendor: Vendor, enterAnimationDuration: string, exitAnimationDuration: string): void {
    console.log('Opening view for Vendor ID:', vendor.id);
    this.dialog.open(VendorsDetailsComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { id: vendor.id }, // Pass only the ID for fetching details
    });
  }

  fetchVendors(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found.');
      alert('No authentication token found. Please log in again.');
      return;
    }

    // Log token for debugging (optional, can be removed in production)
    console.log('Token:', token);
    try {
      const decodedPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', JSON.stringify(decodedPayload, null, 2));
    } catch (e) {
      console.error('Error decoding token:', e);
    }

    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    const payload = {
      pageNumber: 0,
      pageSize: 10,
      userTypeId: 3, // Vendor userTypeId (consistent with requirement)
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    this.http
      .post<UsersListResponse>(`${this.apiUrl}/list`, payload, { headers })
      .subscribe({
        next: (response) => {
          console.log('Response:', JSON.stringify(response, null, 2));
          if (response.status === 1 && response.data?.users?.page) {
            this.vendors = response.data.users.page.filter((user) => user.userType.id === 3);
            console.log('Fetched vendors:', JSON.stringify(this.vendors, null, 2));
          } else {
            console.warn('Unexpected response format:', JSON.stringify(response, null, 2));
            alert('Unexpected response format. Check console for details.');
          }
        },
        error: (err) => {
          console.error('Error fetching vendors:', err);
          console.error('Response body:', err.error);
          console.error('Error details:', JSON.stringify(err, null, 2));
          let errorMessage = 'Failed to load vendors. Please try again.';
          if (err.status === 401) {
            errorMessage = 'Unauthorized: Invalid or expired token. Please log in again.';
          } else if (err.status === 403) {
            errorMessage = 'Forbidden: You lack permission to view vendors.';
            console.warn('Possible cause: Server restricts admin (company_id: 1) from listing vendors across all companies.');
            console.warn('Try adding companyId: 1 to payload or ask backend to allow listing all vendors.');
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          alert(errorMessage);
        },
      });
  }

  updateVendor(updatedVendor: Vendor): void {
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

    if (!updatedVendor.id) {
      alert('Vendor ID is missing for update.');
      return;
    }

    this.http
      .put(`${this.apiUrl}/update`, updatedVendor, { headers })
      .subscribe({
        next: () => {
          this.fetchVendors(); // Refresh vendors list after update
          alert('Vendor updated successfully.');
        },
        error: (err) => {
          console.error('Error updating vendor:', err);
          let errorMessage = 'Failed to update vendor. Please try again.';
          if (err.status === 401) {
            errorMessage = 'Unauthorized: Invalid or expired token. Please log in again.';
          } else if (err.status === 403) {
            errorMessage = 'Forbidden: You lack permission to update vendors.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          alert(errorMessage);
        },
      });
  }
}