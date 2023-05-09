import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamoInternoComponent } from './reclamo-interno.component';

describe('ReclamoInternoComponent', () => {
  let component: ReclamoInternoComponent;
  let fixture: ComponentFixture<ReclamoInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamoInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamoInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
