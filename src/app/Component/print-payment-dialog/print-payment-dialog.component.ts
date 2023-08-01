import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from 'src/app/Data-Model/account';
import { payments } from 'src/app/Data-Model/payments';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-print-payment-dialog',
  templateUrl: './print-payment-dialog.component.html',
  styleUrls: ['./print-payment-dialog.component.css']
})
export class PrintPaymentDialogComponent implements OnInit {

  // Variables used in the Payment Receipt Dialog
  paymentData: any;
  account: any;
  companyName = GlobalComponent.companyName
  companyStreet = GlobalComponent.companyStreet
  companyCityTownVillage = GlobalComponent.companyCityTownVillage
  companyCountry = GlobalComponent.companyCountry
  companyTIN = GlobalComponent.companyTIN
  companyPhoneNumber = GlobalComponent.companyPhoneNumber

  constructor(private dialogRef: MatDialogRef<PrintPaymentDialogComponent>, @Inject(MAT_DIALOG_DATA) printData: Array<any>,
    private paymentService: AccountService) {
      this.paymentData = printData;

      paymentService.getAccount(this.paymentData.accountID).subscribe( accountInfo => {
        this.account = accountInfo.data();
      })
  }

  ngOnInit(): void {
  }

  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
}
