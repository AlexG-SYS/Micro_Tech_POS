import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaymentDialogComponent } from './print-payment-dialog.component';

describe('PrintPaymentDialogComponent', () => {
  let component: PrintPaymentDialogComponent;
  let fixture: ComponentFixture<PrintPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPaymentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
