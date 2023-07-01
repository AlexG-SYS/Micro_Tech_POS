import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Items } from 'src/app/Data-Model/item';
import { Receipt } from 'src/app/Data-Model/receipt';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-report-component',
  templateUrl: './report-component.component.html',
  styleUrls: ['./report-component.component.css'],
})
export class ReportComponentComponent implements OnInit {
  dataSource = new MatTableDataSource<Receipt>();
  monthString = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  date = new Date();
  month = this.monthString[this.date.getMonth()];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Receipt>;
  reportTitle = '';
  subTotal = 0;
  tax = 0;
  salesTotal = 0;

  constructor(private receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.refreshSalesListToday();
  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refreshSalesListToday() {
    let today = this.date.toLocaleDateString().split(/[\s/]+/);
    let day = Number(today[1]);
    let year = Number(today[2]);

    this.reportTitle = '(' + this.month + ' ' + day + ', ' + year + ')';
    this.salesTotal = 0;
    this.tax = 0;
    this.subTotal = 0;

    this.receiptService
      .getReceiptList(this.date.toLocaleDateString())
      .subscribe((receiptData) => {
        const tempRec = receiptData;

        tempRec.forEach((receipt) => {
          receipt.items.forEach((item: any) => {
            this.salesTotal = item.price * item.quantity + this.salesTotal;
            this.tax = item.itemTax * item.quantity + this.tax;
            this.subTotal = item.itemSubTotal * item.quantity + this.subTotal;
          });
        });

        this.dataSource.data = tempRec;
      });
  }

  refreshSalesListYesterday() {
    let today = this.date.toLocaleDateString().split(/[\s/]+/);
    let month = Number(today[0]);
    let day = Number(today[1]);
    let yesterday = day - 1;
    let year = Number(today[2]);

    this.reportTitle = '(' + this.month + ' ' + yesterday + ', ' + year + ')';
    this.salesTotal = 0;
    this.tax = 0;
    this.subTotal = 0;

    for (let counter = this.dataSource.data.length; counter > 0; counter--) {
      this.dataSource.data.pop();
    }

    this.receiptService
      .getReceiptList(month + '/' + yesterday + '/' + year)
      .subscribe((receiptData) => {
        const tempRec = receiptData;

        tempRec.forEach((receipt) => {
          receipt.items.forEach((item: any) => {
            this.salesTotal = item.price * item.quantity + this.salesTotal;
            this.tax = item.itemTax * item.quantity + this.tax;
            this.subTotal = item.itemSubTotal * item.quantity + this.subTotal;
          });
        });

        this.dataSource.data = tempRec;
      });
  }

  refreshSalesListCurrentMonth() {
    let today = this.date.toLocaleDateString().split(/[\s/]+/);
    let month = Number(today[0]);
    let day = Number(today[1]);
    let year = Number(today[2]);

    this.reportTitle = '(' + this.month + ')';
    this.salesTotal = 0;
    this.tax = 0;
    this.subTotal = 0;

    for (let counter = this.dataSource.data.length; counter > 0; counter--) {
      console.log(counter);
      this.dataSource.data.pop();
    }

    for (; day > 0; day--) {
      this.receiptService
        .getReceiptList(month + '/' + day + '/' + year)
        .subscribe((receiptData) => {
          const tempRec = receiptData;

          tempRec.forEach((receipt) => {
            receipt.items.forEach((item: any) => {
              this.salesTotal = item.price * item.quantity + this.salesTotal;
              this.tax = item.itemTax * item.quantity + this.tax;
              this.subTotal = item.itemSubTotal * item.quantity + this.subTotal;
            });

            this.dataSource.data.push(receipt);
            this.dataSource._updateChangeSubscription();
          });
        });
    }
  }

  displayedColumns: string[] = [
    'receiptNumber',
    'date',
    'customerName',
    'total',
    'paymentMeth',
    'salesRep',
  ];
}
