import { TestBed } from '@angular/core/testing';

import { GetMascotas } from './get-mascotas';

describe('GetMascotas', () => {
  let service: GetMascotas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMascotas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
