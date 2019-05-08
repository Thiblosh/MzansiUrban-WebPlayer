import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineHistoryComponent } from './timeline-history.component';

describe('TimelineHistoryComponent', () => {
  let component: TimelineHistoryComponent;
  let fixture: ComponentFixture<TimelineHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
