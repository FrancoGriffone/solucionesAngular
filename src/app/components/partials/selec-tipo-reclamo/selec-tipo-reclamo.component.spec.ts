import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecTipoReclamoComponent } from './selec-tipo-reclamo.component';

describe('SelecTipoReclamoComponent', () => {
  let component: SelecTipoReclamoComponent;
  let fixture: ComponentFixture<SelecTipoReclamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecTipoReclamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecTipoReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
