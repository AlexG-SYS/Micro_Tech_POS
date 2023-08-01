import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { catchError, isEmpty, tap } from 'rxjs';
import { Account } from 'src/app/Data-Model/account';
import { payments } from 'src/app/Data-Model/payments';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';
import { PrintPaymentDialogComponent } from '../print-payment-dialog/print-payment-dialog.component';

@Component({
  selector: 'app-receive-payment-dialog',
  templateUrl: './receive-payment-dialog.component.html',
  styleUrls: ['./receive-payment-dialog.component.css'],
})
export class ReceivePaymentDialogComponent implements OnInit {
  paymentForm!: FormGroup;
  account!: Partial<Account>;
  accountID!: string;
  paymentID!: string;
  oldPayment!: number;
  username: string = GlobalComponent.userName;

  constructor(
    private dialogRef: MatDialogRef<ReceivePaymentDialogComponent>,
    private formB: FormBuilder,
    private changeDet: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) data: any,
    private accountService: AccountService,
    private dialog: MatDialog
  ) {
    if (data.accountID) {
      this.paymentID = data.id;
      this.accountID = data.accountID;
      this.pymMethod = data.paymentMethod;
      this.oldPayment = data.paymentAmount;
      this.account = data;

      this.paymentForm = this.formB.group({
        paymentAmount: [data.paymentAmount, Validators.required],
        reference: [data.reference],
        memo: [data.memo],
      });
    } else {
      this.accountID = data.id;
      this.account = data;

      this.paymentForm = this.formB.group({
        paymentAmount: [, Validators.required],
        reference: [],
        memo: [],
      });
    }
  }

  ngOnInit(): void {
    switch (this.pymMethod) {
      case 'Cash':
        this.paymentMethod(0);
        break;
      case 'Card':
        this.paymentMethod(1);
        break;
      case 'Cheque':
        this.paymentMethod(2);
        break;
      case 'E-Wallet':
        this.paymentMethod(3);
        break;
      case 'Gift Card':
        this.paymentMethod(4);
        break;
      case 'Direct To Bank':
        this.paymentMethod(5);
        break;
      default:
        this.paymentMethod(0);
        break;
    }
  }

  // -------------------------------------------------------------------------------------------------------------
  // Selects the Payment Method
  pymMethod: string = '';
  paymentMethod(index: number) {
    const pmtMethod = document.querySelectorAll('.payment-method-Btn');
    pmtMethod.forEach((element) => {
      element.classList.remove('active');
    });
    pmtMethod[index].classList.add('active');
    this.pymMethod = pmtMethod[index].id.toString();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Executes when the save button is clicked. Adds the payment to the database and updates customer balance information
  save() {
    if (this.paymentForm.valid) {
      const paymentData: payments = this.paymentForm.value;
      paymentData.accountID = this.accountID;
      paymentData.fullName = this.account.fullName as string;
      paymentData.date = new Date().toLocaleDateString();
      paymentData.paymentMethod = this.pymMethod;
      paymentData.salesRep = this.username;

      paymentData.unappliedAmount = paymentData.paymentAmount;

      if (this.paymentID) {
        this.accountService
          .updatePaymentForAccount(this.paymentID, paymentData)
          .subscribe(() => {
            console.log('Payment Successfully Updated! ID:', this.paymentID);

            this.accountService
              .getAccount(this.accountID)
              .subscribe((accountData) => {
                const customerInfo: any = accountData.data();
                delete customerInfo.id;
                customerInfo.balance =
                  customerInfo.balance +
                  this.oldPayment -
                  paymentData.paymentAmount;
                this.accountService.updateAccount(this.accountID, customerInfo);
              });

            this.dialogRef.close(this.paymentID);
          });
      } else {
        this.accountService
          .receivePaymentForAccount(paymentData)
          .pipe(
            tap((payment) => {
              console.log('Payment Successfully Added! ID:', payment.id);

              this.account.balance =
                this.account.balance! - paymentData.paymentAmount;
              delete this.account.id;
              this.accountService.updateAccount(this.accountID, this.account);

              this.dialogRef.close(payment.id);

              const dialogConfig = new MatDialogConfig();

              dialogConfig.disableClose = true;
              dialogConfig.autoFocus = true;
              dialogConfig.minWidth = '450px';
              dialogConfig.data = paymentData;

              this.dialog
                .open(PrintPaymentDialogComponent, dialogConfig)
                .afterClosed()
                .subscribe((val) => {
                  if (val) {
                    console.log('Payment Printed', val);
                  }
                });
            }),
            catchError((error) => {
              this.dialogRef.close();
              throw catchError(error);
            })
          )
          .subscribe();
      }
    }
  }
  // -----------------------------------------------------------------------------------------------------------
}
