import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Miscitas } from './miscitas';

describe('Miscitas', () => {
  let component: Miscitas;
  let fixture: ComponentFixture<Miscitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Miscitas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Miscitas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
