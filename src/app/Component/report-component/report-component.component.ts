import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Items } from 'src/app/Data-Model/item';
import { Receipt } from 'src/app/Data-Model/receipt';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-report-component',
  templateUrl: './report-component.component.html',
  styleUrls: ['./report-component.component.css']
})
export class ReportComponentComponent implements OnInit {

  dataSource = new MatTableDataSource<Receipt>;
  date = new Date().toLocaleDateString();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  reportTitle = "";
  salesTotal = 0;

  constructor(private receiptService: ReceiptService) { }

  ngOnInit(): void {

  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refresReceiptListMale() {
    this.reportTitle = "(Male)"
    this.salesTotal = 0;

    this.receiptService.getReceiptList(this.date).subscribe(receiptData => {
      const tempRec = receiptData;

      // I dont Understand why i have to loop twice to make it work --------------------
      tempRec.forEach(receipt => {
        receipt.items.forEach((item, index) => {
          if (item.category != "male") {
            receipt.items.splice(index, 1)
          }
        })
      })

      tempRec.forEach(receipt => {
        receipt.items.forEach((item, index) => {
          if (item.category != "male") {
            receipt.items.splice(index, 1)
          }
        })
      })
    // -----------------------------------------------------------------------------------

      // I dont Understand why i have to loop twice to make it work --------------------
      tempRec.forEach((receipt, index) => {
        if (receipt.items.length == 0) {
          tempRec.splice(index, 1);
        }
      })

      tempRec.forEach((receipt, index) => {
        if (receipt.items.length == 0) {
          tempRec.splice(index, 1);
        }
      })
    // -----------------------------------------------------------------------------------

      tempRec.forEach(receipt => {
        receipt.items.forEach( (item:any) => {
          this.salesTotal = (item.price * item.quantity) + this.salesTotal
        })
      })

      this.dataSource.data = tempRec;
    })
  }

  refresReceiptListFemale() {
    this.reportTitle = "(Female)"
    this.salesTotal = 0;

    this.receiptService.getReceiptList(this.date).subscribe(receiptData => {
      const tempRec = receiptData;

      // I dont Understand why i have to loop twice to make it work --------------------
      tempRec.forEach(receipt => {
        receipt.items.forEach((item, index) => {
          if (item.category != "female") {
            receipt.items.splice(index, 1)
          }
        })
      })

      tempRec.forEach(receipt => {
        receipt.items.forEach((item, index) => {
          if (item.category != "female") {
            receipt.items.splice(index, 1)
          }
        })
      })
    // -----------------------------------------------------------------------------------

      // I dont Understand why i have to loop twice to make it work --------------------
      tempRec.forEach((receipt, index) => {
        if (receipt.items.length == 0) {
          tempRec.splice(index, 1);
        }
      })

      tempRec.forEach((receipt, index) => {
        if (receipt.items.length == 0) {
          tempRec.splice(index, 1);
        }
      })
    // -----------------------------------------------------------------------------------

      tempRec.forEach(receipt => {
        receipt.items.forEach( (item:any) => {
          this.salesTotal = (item.price * item.quantity) + this.salesTotal
        })
      })

      this.dataSource.data = tempRec;
    })
  }

  displayedColumns: string[] = ['receiptNumber', 'date', 'customerName', 'items', 'paymentMeth'];

}
