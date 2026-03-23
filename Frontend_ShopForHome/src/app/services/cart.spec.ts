import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartService } from './cart';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with cart count 0', () => {
    let count = 0;
    service.cartCount$.subscribe(c => count = c);
    expect(count).toBe(0);
  });

  it('should update cart count to 5', () => {
    service.updateCount(5);
    let count = 0;
    service.cartCount$.subscribe(c => count = c);
    expect(count).toBe(5);
  });
});


