import { TestBed } from '@angular/core/testing';

import { AdminServicce } from './admin-servicce';

describe('AdminServicce', () => {
  let service: AdminServicce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminServicce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
