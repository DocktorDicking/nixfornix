import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourTableTotalComponent } from './hour-table-total.component';

describe('HourTableTotalComponent', () => {
  let component: HourTableTotalComponent;
  let fixture: ComponentFixture<HourTableTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourTableTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourTableTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
