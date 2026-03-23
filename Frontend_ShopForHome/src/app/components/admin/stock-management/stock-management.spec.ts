import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockManagementComponent } from './stock-management';

describe('StockManagement', () => {
  let component: StockManagementComponent;
  let fixture: ComponentFixture<StockManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockManagementComponent, HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(StockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
