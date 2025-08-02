import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class SupplierDetailComponent implements OnInit {
  // Define supplier with the structure matching the create payload
  supplier: {
    id?: number | string;
    username: string;
    password?: string | null;
    lastPasswordResetDate?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    companyId: number | string;
    mobileNo: string;
    userRoleId?: string | number; // Make userRoleId optional since it may not be returned
    createdBy?: string;
    createdOn?: string;
    modifiedBy?: string;
    modifiedOn?: string;
    isActive?: boolean;
    userType?: {
      id: number | string;
      name: string;
      description: string;
      createdBy?: string;
      createdOn?: string;
      modifiedBy?: string;
      modifiedOn?: string;
      isActive?: boolean;
    };
  } = {
    id: undefined,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    companyId: '',
    mobileNo: '',
    userRoleId: undefined, // No default value, will reflect API data
    createdBy: '',
    createdOn: '',
    modifiedBy: '',
    modifiedOn: '',
    isActive: false,
    userType: {
      id: '',
      name: '',
      description: '',
      createdBy: '',
      createdOn: '',
      modifiedBy: '',
      modifiedOn: '',
      isActive: false
    }
  };

  constructor(
    public dialogRef: MatDialogRef<SupplierDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Token missing');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = { userId: this.data.id };

    this.http.post<any>(
      'http://localhost:3030/user-microservice/api/v1/users/view-details',
      payload,
      { headers }
    ).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        if (res.status === 1) {
          this.supplier = { ...this.supplier, ...res.data.user }; // Merge API data with default structure
          if (this.supplier.userRoleId === undefined) {
            console.warn('userRoleId not found in API response. Please update the backend to include userRoleId.');
            // Optionally, you can alert the user or log a more detailed message
          }
        } else {
          alert('Invalid response');
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        alert('Failed to fetch details');
      }
    });
  }
}