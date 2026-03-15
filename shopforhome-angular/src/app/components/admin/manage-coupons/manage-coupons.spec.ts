import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoupons } from './manage-coupons';

describe('ManageCoupons', () => {
  let component: ManageCoupons;
  let fixture: ComponentFixture<ManageCoupons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCoupons],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCoupons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
