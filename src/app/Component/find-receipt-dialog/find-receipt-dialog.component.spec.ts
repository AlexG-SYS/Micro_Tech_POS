import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindReceiptDialogComponent } from './find-receipt-dialog.component';

describe('FindReceiptDialogComponent', () => {
  let component: FindReceiptDialogComponent;
  let fixture: ComponentFixture<FindReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindReceiptDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
