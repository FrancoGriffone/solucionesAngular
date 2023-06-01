import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegajoClienteComponent } from './legajo-cliente.component';

describe('LegajoClienteComponent', () => {
  let component: LegajoClienteComponent;
  let fixture: ComponentFixture<LegajoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegajoClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegajoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
