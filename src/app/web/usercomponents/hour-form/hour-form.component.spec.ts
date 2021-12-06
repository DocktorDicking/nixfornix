import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourFormComponent } from './hour-form.component';

describe('HourFormComponent', () => {
  let component: HourFormComponent;
  let fixture: ComponentFixture<HourFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
