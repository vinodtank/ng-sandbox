import { TestBed } from '@angular/core/testing';

import { V8SharedService } from './v8-shared.service';

describe('V8SharedService', () => {
  let service: V8SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V8SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
