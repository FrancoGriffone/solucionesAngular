import { TestBed } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';

describe('SpinnerService', () => {
  let service: InterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
