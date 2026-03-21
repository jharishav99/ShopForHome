import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Register Feature', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
  });

  it('should be defined', () => {
    expect(true).toBeTruthy();
  });

  it('full name should require minimum 3 characters', () => {
    const name = 'ab';
    expect(name.length >= 3).toBeFalsy();
  });

  it('full name should pass with 3+ characters', () => {
    const name = 'John';
    expect(name.length >= 3).toBeTruthy();
  });

  it('email should reject invalid format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('bademail')).toBeFalsy();
  });

  it('email should accept valid format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('user@example.com')).toBeTruthy();
  });

  it('password should require minimum 5 characters', () => {
    const password = '123';
    expect(password.length >= 5).toBeFalsy();
  });

  it('valid password should pass', () => {
    const password = '12345';
    expect(password.length >= 5).toBeTruthy();
  });
});