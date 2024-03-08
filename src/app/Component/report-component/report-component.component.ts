import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Item } from 'firebase/analytics';
import { forkJoin, Observable } from 'rxjs';
import { Receipt } from 'src/app/Data-Model/receipt';
import { ItemService } from 'src/app/Services/item.service';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-report-component',
  templateUrl: './report-component.component.html',
  styleUrls: ['./report-component.component.css'],
})
export class ReportComponentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('matSortReceipt') sortReceipt!: MatSort;
  @ViewChild('matSortInventory') sortInventory!: MatSort;
  
  dataSourceReceipt = new MatTableDataSource<Receipt>();
  dataSourceInventory = new MatTableDataSource<Item>();

  month = '';
  reportTitle = '';
  subTotal = 0;
  tax = 0;
  totalCost = 0;
  salesTotal = 0;
  profitTotal = 0;
  totalProfitPercentage = 0;

  totalCostInventory = 0;
  totalSubTotalInventory = 0
  salesTotalInventory = 0;
  profitTotalInventory = 0;
  totalProfitPercentageInventory = 0;

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

  displayedColumnsTaxReport: string[] = [
    'receiptNumber',
    'date',
    'customerName',
    'subTotal',
    'tax',
    'total',
    'paymentMeth',
  ];

  displayedColumnsProfitReport: string[] = [
    'receiptNumber',
    'date',
    'customerName',
    'cost',
    'profit',
    'subtotal',
    'profitPercentage',
    'paymentMeth',
  ];

  displayedColumnsInventoryReport: string[] = [
    'upc',
    'description',
    'qty',
    'cost',
    'price',
    'total',
    'profit',
    'profitPercentage',
  ];

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private receiptService: ReceiptService,
    private itemService: ItemService
  ) {}
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.refreshSalesListToday();
    const date = new Date();
    this.month = `(${this.getMonthName(date)})`;

    this.updateInventoryReport();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  ngAfterViewInit() {
    this.dataSourceReceipt.paginator = this.paginator;
    this.dataSourceReceipt.sort = this.sortReceipt;

    this.dataSourceInventory.paginator = this.paginator;
    this.dataSourceInventory.sort = this.sortInventory;
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
    let totalProfit = 0;

    receiptData.forEach((receipt) => {
      let receiptProfit = 0;
      let receiptSubtotal = 0;
      let receiptCost = 0;

      receiptSubtotal = receipt.subtotal;

      for (const item of receipt.items) {
        if (item.quantity !== undefined && item.price !== undefined) {
          // Calculate profit and cost based on item cost price
          receiptCost += item.quantity * (item.cost || 0);
        }
      }

      receiptProfit = receiptSubtotal - receiptCost;

      this.subTotal += receipt.subtotal;
      this.tax += receipt.TAX;
      this.salesTotal += receipt.total;
      this.profitTotal += receiptProfit;
      this.totalCost += receiptCost;
      totalProfit += receiptProfit;
    });

    // Calculate total profit percentage
    this.totalProfitPercentage = (totalProfit / this.totalCost) * 100;

    this.dataSourceReceipt.data = receiptData;
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
    this.dataSourceReceipt.data = [];

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
        this.dataSourceReceipt._updateChangeSubscription();
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
    this.dataSourceReceipt.data = [];

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
        this.dataSourceReceipt._updateChangeSubscription();
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

  // Function to calculate total profit and profit percentage
  receiptProfit(element: any): { profit: number; profitPercentage: number } {
    let total = 0;
    for (const item of element.items) {
      total += item.quantity * item.cost;
    }
    const profit = element.subtotal - total;
    const profitPercentage = (profit / total) * 100;

    return { profit, profitPercentage };
  }

  updateInventoryReport() {
    this.isLoading = true;

    this.itemService.getItemList('active').subscribe((itemData) => {
      // Calculate total cost, sales total, profit total, and total profit percentage
      this.totalCostInventory = this.calculateTotalCost(itemData);
      this.totalSubTotalInventory = this.calculateTotalSubTotal(itemData)
      this.salesTotalInventory = this.calculateTotalSubTotal(itemData);
      this.profitTotalInventory = this.calculateProfitTotal(itemData);
      this.totalProfitPercentageInventory =
        this.calculateTotalProfitPercentage();

      // Update the data source with the received item data
      this.dataSourceInventory.data = itemData;

      // Update the view after processing the data
      this.dataSourceInventory._updateChangeSubscription();

      // Delay progress indicator
      this.delayProgress();
    });
  }

  // Function to calculate total cost
  calculateTotalCost(items: any[]): number {
    let totalCost = 0;
    for (const item of items) {
      totalCost += item.cost * item.quantity || 0;
    }
    return totalCost;
  }

  calculateTotalSubTotal(items: any[]): number {
    let totalSubTotal = 0;
    for (const item of items) {
      totalSubTotal += item.price * item.quantity || 0;
    }
    return totalSubTotal;
  }

  // Function to calculate profit total
  calculateProfitTotal(items: any[]): number {

    // Calculate the profit total
    const profitTotal = this.totalSubTotalInventory - this.totalCostInventory;
    
    return profitTotal;
  }

  // Function to calculate total profit percentage
  calculateTotalProfitPercentage(): number {
    if (this.salesTotalInventory === 0) {
      return 0; // Avoid division by zero
    }


    return ((this.profitTotalInventory * 100) / this.totalCostInventory);
  }
}
