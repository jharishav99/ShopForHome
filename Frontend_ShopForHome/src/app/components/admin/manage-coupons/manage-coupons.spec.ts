import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageCouponsComponent } from './manage-coupons';

describe('ManageCoupons', () => {
  let component: ManageCouponsComponent;
  let fixture: ComponentFixture<ManageCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCouponsComponent, HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ManageCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});