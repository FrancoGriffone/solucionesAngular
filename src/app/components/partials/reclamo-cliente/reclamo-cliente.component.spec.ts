import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamoClienteComponent } from './reclamo-cliente.component';

describe('ReclamoClienteComponent', () => {
  let component: ReclamoClienteComponent;
  let fixture: ComponentFixture<ReclamoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamoClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
