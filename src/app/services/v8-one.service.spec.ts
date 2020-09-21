import { TestBed } from '@angular/core/testing';

import { V8OneService } from './v8-one.service';

describe('V8OneService', () => {
  let service: V8OneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V8OneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
