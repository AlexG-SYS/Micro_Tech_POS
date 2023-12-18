import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { Receipt } from 'src/app/Data-Model/receipt';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-history-component',
  templateUrl: './history-component.component.html',
  styleUrls: ['./history-component.component.css']
})
export class HistoryComponentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Receipt>;
  dataSource = new MatTableDataSource<Receipt>();

  month = '';
  reportTitle = '';
  subTotal = 0;
  tax = 0;
  totalCost = 0;
  salesTotal = 0;
  profitTotal = 0;

  isLoading = true;

  customDateSelection = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  displayedColumnsSalesReport: string[] = [
    'receiptNumber',
    'date',
    'customerName',
    'total',
    'paymentMeth',
    'reference',
    'salesRep',
  ];

  displayedColumnsProfitReport: string[] = [
    'receiptNumber',
    'date',
    'customerName',
    'cost',
    'total',
    'profit',
    'paymentMeth',
  ];

  // -------------------------------------------------------------------------------------------------------------
  constructor(private receiptService: ReceiptService) { }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.refreshSalesListToday();
    const date = new Date();
    this.month = `(${this.getMonthName(date)})`;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Helper function to refresh sales list based on receipt data
  private refreshSalesList(receiptData: Receipt[]): void {
    this.subTotal = 0;
    this.tax = 0;
    this.salesTotal = 0;
    this.profitTotal = 0;
    this.totalCost = 0; 
    
    receiptData.forEach((receipt) => {
      let receiptProfit = 0;
      let receiptCost = 0;

      for (const item of receipt.items) {
        if (item.quantity !== undefined) {
          receiptProfit += item.quantity * (item.cost || 0);
          receiptCost += item.quantity * (item.cost || 0);
        }
      }

      receiptProfit = receipt.total - receiptProfit;

      this.subTotal += receipt.subtotal;
      this.tax += receipt.TAX;
      this.salesTotal += receipt.total;
      this.profitTotal += receiptProfit;
      this.totalCost += receiptCost;
    });

    this.dataSource.data = receiptData;
  }


  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Refresh sales list for today
  refreshSalesListToday() {
    this.isLoading = true;

    const date = new Date();
    const formattedDate = date.toLocaleDateString();

    this.reportTitle = `(${this.getMonthName(
      date
    )} ${date.getDate()}, ${date.getFullYear()})`;

    this.receiptService
      .getReceiptList(formattedDate)
      .subscribe((receiptData) => {
        this.refreshSalesList(receiptData);
      });

    this.delayProgress();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Refresh sales list for yesterday
  refreshSalesListYesterday() {
    this.isLoading = true;

    const date = new Date();
    date.setDate(date.getDate() - 1);
    const formattedDate = date.toLocaleDateString();

    this.reportTitle = `(${this.getMonthName(
      date
    )} ${date.getDate()}, ${date.getFullYear()})`;

    this.receiptService
      .getReceiptList(formattedDate)
      .subscribe((receiptData) => {
        this.refreshSalesList(receiptData);
      });

    this.delayProgress();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Refresh sales list for the current month
  refreshSalesListCurrentMonth() {
    this.isLoading = true;

    // Get the current year and month
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // Update the report title to show the current month
    this.reportTitle = `(${this.getMonthName(currentDate)})`;

    // Clear existing data from the data source
    this.dataSource.data = [];

    // Create an array of observables for fetching receipt data
    const receiptObservables: Observable<Receipt[]>[] = [];

    // Loop through each day of the current month
    for (let day = 1; day <= currentDate.getDate(); day++) {
      // Format the current date for fetching receipt data
      const formattedDate = `${month}/${day}/${year}`;
      const observable = this.receiptService.getReceiptList(formattedDate);
      receiptObservables.push(observable);
    }

    // Combine observables using forkJoin and subscribe to the result
    forkJoin(receiptObservables).subscribe(
      (receiptDataArray) => {
        // Flatten the array of arrays to get all receipt data
        const allReceiptData = receiptDataArray.flat();

        // Utilize the refreshSalesList function to process the data
        this.refreshSalesList(allReceiptData);

        // Update the data source
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Error fetching receipt data:', error);
      }
    );
    this.delayProgress();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Refresh sales list for custom date selection
  refreshSalesListCustomSelection() {
    this.isLoading = true;

    // Get the selected start and end dates from the form
    const startDate = this.customDateSelection.value.startDate;
    const endDate = this.customDateSelection.value.endDate;

    // Update the report title to show the selected date range
    this.reportTitle = `(${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;

    // Clear existing data from the data source
    this.dataSource.data = [];

    // Create an array of observables for fetching receipt data
    const receiptObservables: Observable<Receipt[]>[] = [];

    // Loop through each day within the selected range
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      // Format the current date for fetching receipt data
      const formattedDate = currentDate.toLocaleDateString();
      const observable = this.receiptService.getReceiptList(formattedDate);
      receiptObservables.push(observable);

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Combine observables using forkJoin and subscribe to the result
    forkJoin(receiptObservables).subscribe(
      (receiptDataArray) => {
        // Flatten the array of arrays to get all receipt data
        const allReceiptData = receiptDataArray.flat();

        // Utilize the refreshSalesList function to process the data
        this.refreshSalesList(allReceiptData);

        // Update the data source
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Error fetching receipt data:', error);
      }
    );
    this.delayProgress();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Get the month name from a given date
  private getMonthName(date: Date): string {
    const monthString = [
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

    return monthString[date.getMonth()];
  }
  // -------------------------------------------------------------------------------------------------------------

  delayProgress() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  // Function to calculate receipt Cost
  receiptCost(items: any[]): number {
    let total = 0;
    for (const item of items) {
      total += item.cost * item.quantity;
    }
    return total;
  }

  // Function to calculate total profit
  receiptProfit(element: any): number {
    let total = 0;
    for (const item of element.items) {
      total += item.quantity * item.cost;
    }
    total = element.total - total;

    return total;
  }

}

