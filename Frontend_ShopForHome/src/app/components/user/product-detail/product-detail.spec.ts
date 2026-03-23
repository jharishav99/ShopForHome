import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail, RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductDetail);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with null product', () => {
    const fixture = TestBed.createComponent(ProductDetail);
    const component = fixture.componentInstance;
    expect(component.product).toBeNull();
  });

  it('should start with loading true', () => {
    const fixture = TestBed.createComponent(ProductDetail);
    const component = fixture.componentInstance;
    expect(component.loading).toBeTruthy();
  });
});
