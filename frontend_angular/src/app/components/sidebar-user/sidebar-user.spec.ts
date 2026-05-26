import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarUser } from './sidebar-user';

describe('SidebarUser', () => {
  let component: SidebarUser;
  let fixture: ComponentFixture<SidebarUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
