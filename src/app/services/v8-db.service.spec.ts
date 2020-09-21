import { TestBed } from '@angular/core/testing';

import { V8DbService } from './v8-db.service';

describe('V8DbService', () => {
  let service: V8DbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V8DbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
