import { TestBed } from '@angular/core/testing';

import { V8MailService } from './v8-mail.service';

describe('V8MailService', () => {
  let service: V8MailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V8MailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
