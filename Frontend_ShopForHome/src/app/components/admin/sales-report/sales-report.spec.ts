import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SalesReportComponent as SalesReportComponent } from './sales-report';

describe('SalesReport Component', () => {
  let component: SalesReportComponent;
  let fixture: ComponentFixture<SalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesReportComponent, HttpClientTestingModule, RouterTestingModule, FormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with zero revenue', () => {
    expect(component.totalRevenue).toBe(0);
  });
});