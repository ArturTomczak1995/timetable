import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesScheduleComponent } from './employees-schedule.component';

describe('EmployeesScheduleComponent', () => {
  let component: EmployeesScheduleComponent;
  let fixture: ComponentFixture<EmployeesScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
