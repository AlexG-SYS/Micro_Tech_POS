import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from 'src/app/Data-Model/account';
import { payments } from 'src/app/Data-Model/payments';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-print-payment-dialog',
  templateUrl: './print-payment-dialog.component.html',
  styleUrls: ['./print-payment-dialog.component.css'],
})
export class PrintPaymentDialogComponent {
  // Variables used in the Payment Receipt Dialog
  paymentData: any;
  account: any;
  companyName = GlobalComponent.companyName;
  companyStreet = GlobalComponent.companyStreet;
  companyCityTownVillage = GlobalComponent.companyCityTownVillage;
  companyCountry = GlobalComponent.companyCountry;
  companyTIN = GlobalComponent.companyTIN;
  companyPhoneNumber = GlobalComponent.companyPhoneNumber;

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<PrintPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) printData: Array<any>,
    private paymentService: AccountService
  ) {
    // Initialize paymentData with the data passed to the dialog
    this.paymentData = printData;
    // Fetch account information based on the accountID from paymentData
    this.getAccountInfo(this.paymentData.accountID);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Fetches account information from the account service
  private getAccountInfo(accountID: string): void {
    this.paymentService.getAccount(accountID).subscribe((accountInfo) => {
      // Store the fetched account information in the account variable
      this.account = accountInfo.data();
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close(): void {
    this.dialogRef.close();
  }
  // -------------------------------------------------------------------------------------------------------------
}
