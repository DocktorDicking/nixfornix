import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourTableComponent } from './hour-table.component';

describe('HourTableComponent', () => {
  let component: HourTableComponent;
  let fixture: ComponentFixture<HourTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
