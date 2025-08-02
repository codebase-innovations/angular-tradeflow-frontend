import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

export class Supplier {
  id?: number;
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  employeeId: string = '';
  companyId: number = 0;
  mobileNo: string = '';
  userType: string = ''; // String for dropdown
  userRoleId: number = 0;
  createdBy?: string;
  createdOn?: string;
  modifiedBy?: string;
  modifiedOn?: string;
  isActive?: boolean;
}

interface DialogData {
  isEdit: boolean;
  supplier?: any; // Use 'any' temporarily to avoid type conflicts
}

@Component({
  selector: 'app-suppliers-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './suppliers-dialog.component.html',
  styleUrls: ['./suppliers-dialog.component.scss'],
})
export class SuppliersDialogComponent implements OnInit {
  supplierObj: Supplier = new Supplier();
  formSubmitted = false;
  isEdit: boolean;
  userTypes = Object.values(UserType);
  userRoles = Object.values(UserRole).filter(value => typeof value === 'number') as number[];

  constructor(
    public dialogRef: MatDialogRef<SuppliersDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEdit = data.isEdit;
    if (this.isEdit && data.supplier) {
      this.supplierObj = {
        ...data.supplier,
        userType: typeof data.supplier.userType === 'object' && data.supplier.userType?.name
          ? data.supplier.userType.name
          : data.supplier.userType as string
      };
    }
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.supplier?.id) {
      this.fetchSupplierDetails(this.data.supplier.id);
    }
  }

  private fetchSupplierDetails(id: number): void {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    this.http.get<{ status: number; data: any }>(`http://localhost:3030/user-microservice/api/v1/users/${id}`, { headers }).subscribe({
      next: (response) => {
        if (response.status === 1 && response.data) {
          this.supplierObj = {
            ...response.data,
            userType: typeof response.data.userType === 'object' && response.data.userType?.name
              ? response.data.userType.name
              : response.data.userType as string
          };
        }
      },
      error: (err) => {
        console.error('Error fetching supplier details:', err);
        alert('Failed to load supplier details. Please try again.');
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.formSubmitted = true;

    if (!this.isValidForm()) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = this.isEdit ? this.prepareUpdatePayload() : this.prepareCreatePayload();

    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    const apiUrl = this.isEdit
      ? 'http://localhost:3030/user-microservice/api/v1/users/update'
      : 'http://localhost:3030/user-microservice/api/v1/user/create';

    const httpMethod = this.isEdit ? this.http.post : this.http.post;

    httpMethod.call(this.http, apiUrl, payload, { headers }).subscribe({
      next: () => {
        alert(this.isEdit ? 'Supplier updated successfully!' : 'Supplier created successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(`Error ${this.isEdit ? 'updating' : 'creating'} supplier:`, err);
        let errorMessage = `Failed to ${this.isEdit ? 'update' : 'create'} supplier: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          errorMessage = 'Unauthorized: Invalid or expired token. Please log in again.';
        } else if (err.status === 400) {
          errorMessage = `Bad Request: ${err.error?.message || 'Invalid data provided. Check required fields.'}`;
        } else if (err.status === 403) {
          errorMessage = 'Forbidden: Permission denied. Please check your user permissions.';
        } else if (err.status === 404) {
          errorMessage = 'Not Found: The supplier could not be found.';
        } else if (err.status === 500) {
          errorMessage = 'Server Error: Please try again later.';
        }
        alert(errorMessage);
      },
    });
  }

  isValidForm(): boolean {
    return (
      !!this.supplierObj.username &&
      !!this.supplierObj.firstName &&
      !!this.supplierObj.lastName &&
      !!this.supplierObj.email &&
      !!this.supplierObj.mobileNo &&
      !!this.supplierObj.userType &&
      !!this.supplierObj.userRoleId
    );
  }

  private prepareCreatePayload(): any {
    return {
      username: this.supplierObj.username,
      firstName: this.supplierObj.firstName,
      lastName: this.supplierObj.lastName,
      email: this.supplierObj.email,
      employeeId: this.supplierObj.employeeId,
      companyId: this.supplierObj.companyId,
      mobileNo: this.supplierObj.mobileNo,
      userType: this.supplierObj.userType,
      userRoleId: this.supplierObj.userRoleId
    };
  }

  private prepareUpdatePayload(): any {
    return {
      id: this.supplierObj.id,
      username: this.supplierObj.username,
      firstName: this.supplierObj.firstName,
      lastName: this.supplierObj.lastName,
      email: this.supplierObj.email,
      employeeId: this.supplierObj.employeeId,
      companyId: this.supplierObj.companyId,
      mobileNo: this.supplierObj.mobileNo,
      userType: this.supplierObj.userType,
      userRoleId: this.supplierObj.userRoleId,
      modifiedBy: 'admin',
      modifiedOn: new Date().toISOString(),
      isActive: this.supplierObj.isActive !== undefined ? this.supplierObj.isActive : true
    };
  }
}