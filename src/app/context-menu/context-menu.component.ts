import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit} from '@angular/core';


import {Shifts} from '../models/shifts';
import {Leave} from '../models/leave.model';
import {ContextMenuSettingsService} from '../services/context-menu-settings.service';
import {Observable} from 'rxjs';
import {LeavesService} from '../services/leaves.service';
import {ShiftHoursService} from '../services/shift-hours.service';
import * as moment from 'moment';
import {ShiftService} from '../services/shift.service';
import {EmployeeForm} from '../models/employee-form.model';


@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  constructor(
    private contextMenuSettings: ContextMenuSettingsService,
    private leavesService: LeavesService,
    private shiftHoursService: ShiftHoursService,
    private shiftService: ShiftService
  ) {
  }

  @Input() x: number;
  @Input() y: number;
  @Input() employeeForm: EmployeeForm;
  @Output() contextMenuBool = new EventEmitter();
  @ViewChild('CMI') contextMenu: ElementRef;
  @ViewChild('CM') contextMenuOption: ElementRef;
  @ViewChild('LeaveOptions') LeaveOptions: ElementRef;

  private shiftModel1 = {shiftStart: '06:00', shiftEnd: '18:00'};
  private leaveReasonModel = new Leave( '');

  private leaveOptionsContext = false;
  private shiftOptionsContext = false;
  private showOptions = false;
  private addLeaveReasonWindow = false;
  private leavesReasonsArr = [];
  private shiftsHoursArr = [];
  private addShiftOptionsBool = false;

  private shifts: Shifts = new Shifts(null, null);

  contextMenuWidth: number;
  contextMenuHeight: number;
  contextMenuLeavePosition: object;
  contextMenuShiftPosition: object;

  positionInitialization: Observable<boolean>;

  ngOnInit() {
    this.positionContextMenu();
    setTimeout(() => {
      this.getLeaveReasons();
      this.getShiftHours();
      this.contextMenuSettings.currentMessage.subscribe(() => this.default());
    }, 0);
  }

  positionContextMenu() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.contextMenuWidth = this.contextMenu.nativeElement.offsetWidth;
    this.contextMenuHeight = this.contextMenu.nativeElement.offsetHeight;

    if (this.x + this.contextMenuWidth >= windowWidth) {
      this.x -= this.contextMenuWidth;
    }
    if (this.y + this.contextMenuHeight >= windowHeight) {
      this.y -= this.contextMenuHeight;
    }
    this.positionContextMenuOptions();
    this.positionInitialization = Observable.create(observer => {
      observer.next(true);
    });
  }

  positionContextMenuOptions() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const contextMenuOptionHeight = this.contextMenuOption.nativeElement.offsetHeight;
    const contextMenuOptionWidth = this.contextMenuOption.nativeElement.offsetWidth;
    const leavesLen = this.leavesReasonsArr.length;
    let positionX = this.contextMenuWidth + this.x;
    let positionY = this.contextMenuHeight - (contextMenuOptionHeight / 2) - 45 + this.y; // 5 = padding

    if (positionX + contextMenuOptionWidth >= windowWidth) {
      positionX = this.x - this.contextMenuWidth;
    }
    if (positionY + leavesLen * contextMenuOptionHeight >= windowHeight) {
      positionY -= leavesLen * contextMenuOptionHeight + contextMenuOptionHeight / 2;
    }
    this.contextMenuLeavePosition = {'left.px': positionX, 'top.px': positionY};
    this.contextMenuShiftPosition = {'left.px': positionX, 'top.px': positionY - 40};
  }

  default() {
    this.showOptions = false;
    this.leaveOptionsContext = false;
  }

  showShiftWindow(isAddShift) {
    this.addShiftOptionsBool = isAddShift;
    this.showOptions = true;
    this.positionInitialization = Observable.create(observer => {
      observer.next(false);
    });
  }


  showAddLeaveReasonWindow() {
    this.addLeaveReasonWindow = true;
    this.positionInitialization = Observable.create(observer => {
      observer.next(false);
    });
  }

  addShift(shift) {
    event.preventDefault();
    const employeeId = this.employeeForm.id;
    const shiftStartTimestamp = moment(this.employeeForm.date + ' ' + shift.shiftStart, 'YYYY-MM-DD HH:mm').valueOf();
    const shiftEndTimestamp = moment(this.employeeForm.date + ' ' + shift.shiftEnd, 'YYYY-MM-DD HH:mm').valueOf();
    console.log(employeeId, shiftStartTimestamp, shiftEndTimestamp);
    this.shifts.setshiftStart(shiftStartTimestamp);
    this.shifts.setshiftEnd(shiftEndTimestamp);
    this.shiftService.addShift(employeeId, this.shifts).subscribe(data => console.log(data));
    this.contextMenuBool.emit(false);
  }

  addLeave(leave) {
    console.log(leave);
    this.contextMenuBool.emit(false);
  }

  addLeaveReason(leaveReason) {
    this.contextMenuBool.emit(false);
    this.leavesService.addLeaves(leaveReason)
      .subscribe(data => {console.log(data);
      });
  }

  getLeaveReasons() {
    this.leavesService.getLeaves()
      .subscribe(data => {this.leavesReasonsArr = data;
      });
  }

  getShiftHours() {
    this.shiftHoursService.getHours()
      .subscribe(data => {this.shiftsHoursArr = data; });
  }

  addShiftOption(hoursOption) {
    this.shiftHoursService.addHours(hoursOption)
      .subscribe(data => console.log(data));
    this.contextMenuBool.emit(false);
}

// TODO make add shift hours button work, and optimize this code

}
