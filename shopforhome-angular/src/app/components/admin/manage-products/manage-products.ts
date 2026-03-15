import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-products.html'
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  editMode = false;
  editId: number | null = null;
  message = '';
  selectedFile: File | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder) {
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
  }

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void { this.productService.getAll().subscribe(p => this.products = p); }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    if (this.editMode && this.editId) {
      this.productService.update(this.editId, this.productForm.value).subscribe(() => {
        this.message = 'Updated!'; this.resetForm(); this.loadProducts();
      });
    } else {
      this.productService.create(this.productForm.value).subscribe(() => {
        this.message = 'Product created!'; this.resetForm(); this.loadProducts();
      });
    }
  }

  editProduct(p: Product): void {
    this.editMode = true; this.editId = p.productId!;
    this.productForm.patchValue(p); window.scrollTo(0, 0);
  }

  deleteProduct(id: number): void {
    if (confirm('Delete this product?')) {
      this.productService.delete(id).subscribe(() => { this.message = 'Deleted!'; this.loadProducts(); });
    }
  }

  onFileSelected(e: any): void { this.selectedFile = e.target.files[0]; }

  uploadCsv(): void {
    if (!this.selectedFile) return;
    this.productService.uploadCsv(this.selectedFile).subscribe({
      next: () => { this.message = 'CSV uploaded!'; this.loadProducts(); },
      error: () => this.message = 'Upload failed.'
    });
  }

  resetForm(): void {
    this.editMode = false; this.editId = null;
    this.productForm.reset({ isActive: true, price: 0, stock: 0, rating: 0 });
    setTimeout(() => this.message = '', 3000);
  }
}