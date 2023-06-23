import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalComponent } from 'src/app/global-component';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-print-receipt-dialog',
  templateUrl: './print-receipt-dialog.component.html',
  styleUrls: ['./print-receipt-dialog.component.css']
})
export class PrintReceiptDialogComponent implements OnInit {

  companyName = GlobalComponent.companyName
  companyStreet = GlobalComponent.companyStreet
  companyCityTownVillage = GlobalComponent.companyCityTownVillage
  companyCountry = GlobalComponent.companyCountry
  companyTIN = GlobalComponent.companyTIN
  companyPhoneNumber = GlobalComponent.companyPhoneNumber

  // Variables used in the Receipt Dialog
  change: number = 0;
  receiptData: any;
  subTotal: number = 0;
  tax: number = 0;
  total: number = 0;
  username: string = GlobalComponent.userName;

  // Constructor Initiallizing the receipt data 
  constructor(private dialogRef: MatDialogRef<PrintReceiptDialogComponent>, @Inject(MAT_DIALOG_DATA) printData: Array<any>,
  private recService: ReceiptService) {
    this.change = printData[0];
    this.receiptData = printData[1];
    this.receiptData.items.forEach((item: any) => {
      this.total = (item.quantity * item.price) + this.total;
    });
    this.tax = (this.total * 0.125);
    this.subTotal = this.total - this.tax;
   }

  ngOnInit(): void {
  }

  // Closes the Dialog
  close(){
    this.dialogRef.close();
  }
}
