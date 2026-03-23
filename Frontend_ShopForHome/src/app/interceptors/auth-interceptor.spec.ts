import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { authInterceptorFn } from './auth-interceptor';

describe('authInterceptorFn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
  });

  it('should be defined', () => {
    expect(authInterceptorFn).toBeTruthy();
  });
});
