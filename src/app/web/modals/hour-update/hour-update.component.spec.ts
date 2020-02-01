import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourUpdateComponent } from './hour-update.component';

describe('HourUpdateComponent', () => {
  let component: HourUpdateComponent;
  let fixture: ComponentFixture<HourUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
