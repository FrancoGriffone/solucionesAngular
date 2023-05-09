import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BCargoComponent } from './b-cargo.component';

describe('BCargoComponent', () => {
  let component: BCargoComponent;
  let fixture: ComponentFixture<BCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BCargoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
