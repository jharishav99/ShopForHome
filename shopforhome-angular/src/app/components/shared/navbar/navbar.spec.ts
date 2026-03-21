import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Navbar } from './navbar';

describe('Navbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Navbar);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    fixture.destroy(); // ← manually destroy to prevent cleanup error
  });

  it('should show login link when not logged in', () => {
    const fixture = TestBed.createComponent(Navbar);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalsy();
    fixture.destroy();
  });

  it('should not show admin link when not admin', () => {
    const fixture = TestBed.createComponent(Navbar);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isAdmin).toBeFalsy();
    fixture.destroy();
  });
});