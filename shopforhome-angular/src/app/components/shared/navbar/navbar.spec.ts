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
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show login link when not logged in', () => {
    const fixture = TestBed.createComponent(Navbar);
    const component = fixture.componentInstance;
    expect(component.isLoggedIn).toBeFalsy();
  });

  it('should not show admin link when not admin', () => {
    const fixture = TestBed.createComponent(Navbar);
    const component = fixture.componentInstance;
    expect(component.isAdmin).toBeFalsy();
  });
});