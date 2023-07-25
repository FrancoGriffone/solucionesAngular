import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamosVariosComponent } from './reclamos-varios.component';

describe('ReclamosVariosComponent', () => {
  let component: ReclamosVariosComponent;
  let fixture: ComponentFixture<ReclamosVariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamosVariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamosVariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
