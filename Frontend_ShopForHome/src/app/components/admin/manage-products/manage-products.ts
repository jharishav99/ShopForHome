import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product';
import { AdminService } from '../../../services/admin';
import { Product, Category } from '../../../models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-products.html'
})
export class ManageProducts implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  categoryForm: FormGroup;
  editMode = false;
  editId: number | null = null;
  message = '';
  messageType = 'success';
  selectedCsvFile: File | null = null;
  showCategoryPanel = false;
  uploadingImage = false;
  imagePreview = '';

  constructor(
    private productService: ProductService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, Validators.required],
      rating: [0],
      imageUrl: [''],
      categoryId: [null],
      isActive: [true]
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    // Watch imageUrl field changes to update preview
    this.productForm.get('imageUrl')?.valueChanges.subscribe(url => {
      this.imagePreview = url || '';
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: p => this.products = p,
      error: () => this.showMsg('Failed to load products.', 'danger')
    });
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: c => this.categories = c,
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.showMsg('Please fill all required fields.', 'danger');
      return;
    }

    const formData = this.productForm.value;

    if (this.editMode && this.editId) {
      const updateData = { ...formData, productId: this.editId };
      this.productService.update(this.editId, updateData).subscribe({
        next: () => {
          this.showMsg('Product updated successfully.', 'success');
          this.resetForm();
          this.loadProducts();
        },
        error: () => this.showMsg('Update failed.', 'danger')
      });
    } else {
      this.productService.create(formData).subscribe({
        next: () => {
          this.showMsg('Product created successfully.', 'success');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => this.showMsg('Create failed: ' + (err.error || ''), 'danger')
      });
    }
  }

  editProduct(p: Product): void {
    this.editMode = true;
    this.editId = p.productId!;
    this.productForm.patchValue({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      rating: p.rating || 0,
      imageUrl: p.imageUrl || '',
      categoryId: p.categoryId || null,
      isActive: p.isActive !== false
    });
    this.imagePreview = p.imageUrl || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.showMsg('Product deleted.', 'success');
          this.loadProducts();
        },
        error: () => this.showMsg('Delete failed.', 'danger')
      });
    }
  }

  // Upload image file to backend → get URL back → set in form
  uploadImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showMsg('Please select an image file.', 'danger');
      return;
    }

    this.uploadingImage = true;
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(
      `${environment.apiUrl}/products/uploadimage`, formData
    ).subscribe({
      next: (res) => {
        this.productForm.patchValue({ imageUrl: res.imageUrl });
        this.imagePreview = res.imageUrl;
        this.uploadingImage = false;
        this.showMsg('Image uploaded successfully.', 'success');
      },
      error: () => {
        // Fallback: use local assets path
        this.uploadingImage = false;
        this.showMsg('Upload failed. Use an image URL instead.', 'danger');
      }
    });
  }

  // CSV bulk upload
  onCsvFileSelected(e: any): void {
    this.selectedCsvFile = e.target.files[0];
  }

  uploadCsv(): void {
    if (!this.selectedCsvFile) {
      this.showMsg('Select a CSV file first.', 'danger');
      return;
    }
    this.productService.uploadCsv(this.selectedCsvFile).subscribe({
      next: (res: any) => {
        this.showMsg(`CSV uploaded. ${res.count || ''} products added.`, 'success');
        this.selectedCsvFile = null;
        this.loadProducts();
      },
      error: () => this.showMsg('CSV upload failed.', 'danger')
    });
  }

  addCategory(): void {
    if (this.categoryForm.invalid) return;
    this.adminService.createCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.showMsg('Category added.', 'success');
        this.categoryForm.reset();
        this.showCategoryPanel = true;
        this.loadCategories();
      },
      error: () => this.showMsg('Failed to add category.', 'danger')
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Delete this category? Products using it will lose their category.')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => {
          this.showMsg('Category deleted.', 'success');
          this.loadCategories();
        },
        error: () => this.showMsg('Cannot delete — products may be using it.', 'danger')
      });
    }
  }

  getCategoryName(id: number | null | undefined): string {
    if (!id) return 'None';
    return this.categories.find(c => c.categoryId === id)?.name || 'None';
  }

  resetForm(): void {
    this.editMode = false;
    this.editId = null;
    this.imagePreview = '';
    this.productForm.reset({
      isActive: true,
      price: 0,
      stock: 0,
      rating: 0,
      imageUrl: ''
    });
    setTimeout(() => this.message = '', 4000);
  }

  showMsg(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}