import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Receipt } from 'src/app/Data-Model/receipt';
import { GlobalComponent } from 'src/app/global-component';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-print-receipt-dialog',
  templateUrl: './print-receipt-dialog.component.html',
  styleUrls: ['./print-receipt-dialog.component.css'],
})
export class PrintReceiptDialogComponent implements OnInit {
  companyName = GlobalComponent.companyName;
  companyStreet = GlobalComponent.companyStreet;
  companyCityTownVillage = GlobalComponent.companyCityTownVillage;
  companyCountry = GlobalComponent.companyCountry;
  companyTIN = GlobalComponent.companyTIN;
  companyPhoneNumber = GlobalComponent.companyPhoneNumber;

  // Variables used in the Receipt Dialog
  change: number = 0;
  receiptData: Receipt;
  subTotal: number = 0;
  discount: number = 0;
  tax: number = 0;
  total: number = 0;
  username: string = GlobalComponent.userName;

  // Constructor Initiallizing the receipt data
  constructor(
    private dialogRef: MatDialogRef<PrintReceiptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) printData: any,
    private recService: ReceiptService
  ) {
    this.receiptData = printData[0];
    this.subTotal = this.receiptData.subtotal;
    this.discount = this.receiptData.discount;
    this.tax = this.receiptData.TAX;
    this.total = this.receiptData.total;
    this.change = this.receiptData.change;
  }

  ngOnInit(): void {}

  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
}
