import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ✅ Enums
export enum UserType {
  Admin = 'Admin',
  Supplier = 'Supplier',
  Vendor = 'Vendor',
  Customer = 'Customer'
}

export enum UserRole {
  Admin = 1,
  Supplier = 2,
  Vendor = 3
}

// ✅ Vendor Model — NO DEFAULTS
export class Vendor {
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  employeeId: string = '';
  companyId: number = 0;
  mobileNo: string = '';
  userType: string = ''; // No default
  userRoleId: number = 0; // No default
}

@Component({
  selector: 'app-vendors-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vendors-dialog.component.html',
  styleUrls: ['./vendors-dialog.component.scss'],
})
export class VendorsDialogComponent {
  vendorObj: Vendor = new Vendor();
  formSubmitted = false;

  // ✅ Dropdown arrays — same
  userTypes = Object.values(UserType);
  userRoles = Object.keys(UserRole)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      id: Number(key),
      name: UserRole[Number(key)]
    }));

  constructor(
    public dialogRef: MatDialogRef<VendorsDialogComponent>,
    private http: HttpClient
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.formSubmitted = true;

    if (!this.isValidForm()) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      username: this.vendorObj.username,
      firstName: this.vendorObj.firstName,
      lastName: this.vendorObj.lastName,
      email: this.vendorObj.email,
      employeeId: this.vendorObj.employeeId || '',
      companyId: this.vendorObj.companyId || 0,
      mobileNo: this.vendorObj.mobileNo,
      userType: this.vendorObj.userType || '',
      userRoleId: this.vendorObj.userRoleId || 0,
    };

    const token = localStorage.getItem('access_token') || '';
    console.log('Access token:', token);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    this.http.post(
      'http://localhost:3030/user-microservice/api/v1/user/create',
      payload,
      { headers }
    ).subscribe({
      next: (res) => {
        console.log('API response:', res);
        alert('Vendor created successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating vendor:', err);
        let errorMessage = `Failed to create vendor: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          errorMessage = 'Unauthorized: Invalid or expired token.';
        }
        alert(errorMessage);
      },
    });
  }

  isValidForm(): boolean {
    return (
      !!this.vendorObj.username &&
      !!this.vendorObj.firstName &&
      !!this.vendorObj.lastName &&
      !!this.vendorObj.email &&
      !!this.vendorObj.mobileNo &&
      !!this.vendorObj.userType &&
     !!this.vendorObj.userRoleId
    );
  }
}
