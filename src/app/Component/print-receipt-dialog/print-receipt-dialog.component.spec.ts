import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceiptDialogComponent } from './print-receipt-dialog.component';

describe('PrintReceiptDialogComponent', () => {
  let component: PrintReceiptDialogComponent;
  let fixture: ComponentFixture<PrintReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceiptDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
