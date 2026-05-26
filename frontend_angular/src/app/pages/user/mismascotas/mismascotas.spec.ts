import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mismascotas } from './mismascotas';

describe('Mismascotas', () => {
  let component: Mismascotas;
  let fixture: ComponentFixture<Mismascotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mismascotas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mismascotas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
