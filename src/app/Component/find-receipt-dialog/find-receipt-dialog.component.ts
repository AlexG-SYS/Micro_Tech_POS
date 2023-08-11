import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { Account } from 'src/app/Data-Model/account';
import { Receipt } from 'src/app/Data-Model/receipt';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { PrintReceiptDialogComponent } from '../print-receipt-dialog/print-receipt-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-find-receipt-dialog',
  templateUrl: './find-receipt-dialog.component.html',
  styleUrls: ['./find-receipt-dialog.component.css'],
})
export class FindReceiptDialogComponent {
  // ViewChild for MatSort
  @ViewChild(MatSort) sort!: MatSort;

  // Data sources and form controls
  dataSourceReceipt = new MatTableDataSource<Receipt>();
  receiptSearchField = new FormControl('');
  accountSearchField = new FormControl('');

  // User privilege and error handling
  privilege = GlobalComponent.privilege;
  error = '';

  // Autocomplete options and accounts data array
  autoCompleteDataAccount: string[] = [];
  accountsDataArray: Account[] = [];

  // Observable for filtered autocomplete options
  filteredOptionsAccount!: Observable<string[]>;

  // Displayed columns for the receipt table
  displayedColumnsReceipt: string[] = [
    'receiptNumber',
    'date',
    'paymentMeth',
    'total',
    'menu',
  ];

  // -----------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<FindReceiptDialogComponent>,
    private formB: FormBuilder,
    private receiptService: ReceiptService,
    private accountService: AccountService,
    public router: Router,
    private dialog: MatDialog
  ) {}
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  ngOnInit() {
    // Initialize component on initialization
    this.refreshActiveAccountList();

    // Subscribe to changes in account search field for autocomplete
    this.filteredOptionsAccount = this.accountSearchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccount(value || ''))
    );
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // When the component view has been shown
  ngAfterViewInit() {
    this.dataSourceReceipt.sort = this.sort;
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Filter autocomplete options based on user input
  private _filterAccount(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteDataAccount.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Retrieve active accounts for autocomplete
  refreshActiveAccountList() {
    this.accountService.getAccountList('active').subscribe((accountData) => {
      this.accountsDataArray = accountData;
      this.autoCompleteDataAccount = this.accountsDataArray
        .map((account) => account.fullName)
        .sort();
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Edit receipt button: navigate to edit receipt page
  editReceiptBtn(data: Partial<Receipt>) {
    this.close();
    this.router.navigate(['/dashboard/receipt/0/new/' + data.id]);
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // View receipt: open a dialog to print the receipt
  viewReceipt(recData: Array<any>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '450px';
    dialogConfig.data = [recData];

    this.dialog
      .open(PrintReceiptDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log('Receipt Printed', val);
        }
      });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Find receipt by number
  findReceiptByNum() {
    this.accountSearchField.reset();
    if (this.receiptSearchField.valid) {
      this.error = '';
      const formSearchValue = Number(this.receiptSearchField.value);

      this.receiptService
        .findReceiptWithNumber(formSearchValue)
        .subscribe((receiptList) => {
          this.dataSourceReceipt.data = receiptList;
          if (receiptList[0] == null) {
            this.error = 'No Receipt Found*';
          }
        });
    } else {
      this.error = 'Invalid Input*';
      this.receiptSearchField.reset();
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Find receipt by account name
  findReceiptByName(searchValue: any) {
    this.receiptSearchField.reset();
    if (this.accountSearchField.valid) {
      this.error = '';
      let formSearchValue = '';

      if (searchValue == '') {
        formSearchValue = this.accountSearchField.value!;
      } else {
        const selectedAccount = this.accountsDataArray.find(
          (account) => account.fullName === searchValue.source.value
        );
        if (selectedAccount) {
          formSearchValue = selectedAccount.id;
        }
      }

      this.receiptService
        .getReceiptsForAccount(formSearchValue!)
        .subscribe((receiptList) => {
          this.dataSourceReceipt.data = receiptList;
          if (receiptList[0] == null) {
            this.error = 'No Receipt Found*';
          }
        });
    } else {
      this.error = 'Invalid Input*';
      this.accountSearchField.reset();
    }
  }
  // -----------------------------------------------------------------------------------------------------------
}
