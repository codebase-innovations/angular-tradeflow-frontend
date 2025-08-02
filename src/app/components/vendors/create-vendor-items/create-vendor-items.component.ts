import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Editor, Toolbar } from 'ngx-editor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-vendor-items',
  templateUrl: './create-vendor-items.component.html',
  styleUrls: ['./create-vendor-items.component.scss']
})
export class CreateVendorItemsComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  editor: Editor;
  categories: any[] = [];
  userTypes = [
    { id: 1, name: 'Admin' },
    { id: 3, name: 'Vendor' },
    { id: 2, name: 'Supplier' }, // koi bhi dekhlo, backend filter karega
  ];
  selectedSingleFile: File | null = null;
  selectedMultipleFiles: File[] = [];
  singleImagePreview: string | null = null;
  galleryImagePreviews: string[] = [];
  submitting = false;

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sku: ['', Validators.required],
      itemCategoryId: [null, Validators.required],
      userTypeId: [null, Validators.required], // user khud select karega
      userId: [null, Validators.required],     // user khud fill karega
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

    // ✅ Check token & role
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('⚠️ Please log in.');
      this.router.navigate(['/authentication/login']);
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userTypeId = parseInt(payload.user_type_id, 10);

    if (userTypeId !== 1 && userTypeId !== 3) {
      alert('❌ Only Admin or Vendor can create vendor items.');
      this.router.navigate(['/authentication/login']);
      return;
    }

    console.log('✅ Logged in userType:', userTypeId);
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

  onSingleFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Single image must be < 5MB');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('❌ Only JPEG & PNG allowed.');
        return;
      }
      this.selectedSingleFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.singleImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onMultipleFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (input.files.length > 5) {
        alert('❌ Max 5 gallery images.');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      const files = Array.from(input.files);
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024 || !validTypes.includes(file.type)) {
          alert(`❌ Invalid file: ${file.name}`);
          return;
        }
      }
      this.selectedMultipleFiles = files;
      this.galleryImagePreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.galleryImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.selectedSingleFile) {
      alert('❌ Fill all required fields & select images.');
      this.markFormGroupTouched();
      return;
    }

    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const itemPayload = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      sku: this.productForm.value.sku,
      itemCategoryId: this.productForm.value.itemCategoryId,
      userTypeId: this.productForm.value.userTypeId, // user se aaye
      userId: this.productForm.value.userId,         // user se aaye
      itemVariants: this.productForm.value.itemVariants
    };

    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemPayload)], { type: 'application/json' }));
    formData.append('files', this.selectedSingleFile, this.selectedSingleFile.name);
    this.selectedMultipleFiles.forEach(file => {
      formData.append('files', file, file.name);
    });

    this.submitting = true;

    this.http.post('http://localhost:3030/inventory-microservice/api/v1/vendor/item/create', formData, { headers })
      .subscribe({
        next: res => {
          console.log('✅ Created:', res);
          alert('✅ Vendor item created!');
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('❌ Error:', err);
          if (err.status === 401) {
            alert('❌ Unauthorized — please login.');
            this.router.navigate(['/authentication/login']);
          } else {
            alert('❌ Failed to create vendor item.');
          }
        },
        complete: () => this.submitting = false
      });
  }

  private resetForm(): void {
    this.productForm.reset();
    this.itemVariants.clear();
    this.addVariant();
    this.selectedSingleFile = null;
    this.selectedMultipleFiles = [];
    this.singleImagePreview = null;
    this.galleryImagePreviews = [];
  }
  

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            Object.keys(c.controls).forEach(k => {
              c.get(k)?.markAsTouched();
            });
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }
}
