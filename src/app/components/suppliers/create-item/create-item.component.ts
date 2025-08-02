import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  editor: Editor;
  categories: any[] = [];
  userTypes: any[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Supplier' },
    { id: 3, name: 'Vendor' }
  ];
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right'],
    ['horizontal_rule', 'format_clear'],
  ];

  selectedSingleFile: File | null = null;
  selectedMultipleFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sku: ['', Validators.required],
      itemCategoryId: [null, Validators.required],
      userTypeId: [null, Validators.required], // user select karega
      userId: [null, Validators.required],     // user fill karega
      itemVariants: this.fb.array([
        this.fb.group({
          color: ['', Validators.required],
          size: ['', Validators.required],
          priceAdditional: [0, [Validators.required, Validators.min(0)]],
        })
      ])
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loadCategories(): void {
    this.categories = [
      { id: 1, name: 'Clothing' },
      { id: 2, name: 'Electronics' },
      { id: 3, name: 'Accessories' },
      { id: 4, name: 'Footwear' },
    ];
  }

  get itemVariants(): FormArray {
    return this.productForm.get('itemVariants') as FormArray;
  }

  addVariant(): void {
    this.itemVariants.push(this.fb.group({
      color: ['', Validators.required],
      size: ['', Validators.required],
      priceAdditional: [0, [Validators.required, Validators.min(0)]],
    }));
  }

  removeVariant(index: number): void {
    this.itemVariants.removeAt(index);
  }

  onSingleFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedSingleFile = file;
    }
  }

  onMultipleFilesSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length) {
      this.selectedMultipleFiles = Array.from(files);
    }
  }

  private getAllFiles(): File[] {
    const allFiles: File[] = [];
    if (this.selectedSingleFile) {
      allFiles.push(this.selectedSingleFile);
    }
    if (this.selectedMultipleFiles.length > 0) {
      allFiles.push(...this.selectedMultipleFiles);
    }
    return allFiles;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      const item = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        sku: this.productForm.value.sku,
        itemCategoryId: Number(this.productForm.value.itemCategoryId),
        userTypeId: Number(this.productForm.value.userTypeId),
        userId: Number(this.productForm.value.userId),
        itemVariants: this.productForm.value.itemVariants
      };

      formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));

      const allFiles = this.getAllFiles();
      allFiles.forEach(file => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('access_token') || '';
      const headers = new HttpHeaders({
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      });

      const url = 'http://localhost:3030/inventory-microservice/api/v1/supplier/item/create';

      this.http.post<any>(url, formData, { headers }).subscribe({
        next: (response) => {
          console.log('✅ Product created:', response);
          alert('Product created successfully!');
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error creating product:', error);
          alert('Failed to create product: ' + error.message);
        }
      });
    } else {
      alert('⚠️ Please fill all required fields.');
      this.markFormGroupTouched();
    }
  }

  private resetForm(): void {
    this.productForm.reset();
    this.itemVariants.clear();
    this.addVariant();
    this.selectedSingleFile = null;
    this.selectedMultipleFiles = [];
    const singleFileInput = document.querySelector('input[type="file"]:not([multiple])') as HTMLInputElement;
    const multipleFileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    if (singleFileInput) singleFileInput.value = '';
    if (multipleFileInput) multipleFileInput.value = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach(innerKey => {
                arrayControl.get(innerKey)?.markAsTouched();
              });
            }
          });
        }
      }
    });
  }
}
