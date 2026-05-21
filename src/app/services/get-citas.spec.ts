import { TestBed } from '@angular/core/testing';

import { GetCitas } from './get-citas';

describe('GetCitas', () => {
  let service: GetCitas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCitas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
