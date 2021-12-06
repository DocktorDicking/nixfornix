import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourTableRecentComponent } from './hour-table-recent.component';

describe('HourTableComponent', () => {
  let component: HourTableRecentComponent;
  let fixture: ComponentFixture<HourTableRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourTableRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourTableRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
