import { TestBed } from '@angular/core/testing';

import { GetDashboardUser } from './get-dashboard-user';

describe('GetDashboardUser', () => {
  let service: GetDashboardUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDashboardUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
