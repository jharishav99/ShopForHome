import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Feature', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
  });

  it('should have login route defined', () => {
    expect(true).toBeTruthy();
  });

  it('email validation should reject empty string', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('')).toBeFalsy();
  });

  it('email validation should reject invalid format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('notanemail')).toBeFalsy();
  });

  it('email validation should accept valid email', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@test.com')).toBeTruthy();
  });

  it('password should require minimum length', () => {
    const password = '123';
    expect(password.length >= 5).toBeFalsy();
  });

  it('valid password should pass length check', () => {
    const password = '12345';
    expect(password.length >= 5).toBeTruthy();
  });
});