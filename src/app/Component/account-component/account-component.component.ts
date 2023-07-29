import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { Account } from 'src/app/Data-Model/account';
import { payments } from 'src/app/Data-Model/payments';
import { Receipt } from 'src/app/Data-Model/receipt';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { EditAccountDialogComponent } from '../edit-account-dialog/edit-account-dialog.component';
import { PrintPaymentDialogComponent } from '../print-payment-dialog/print-payment-dialog.component';
import { PrintReceiptDialogComponent } from '../print-receipt-dialog/print-receipt-dialog.component';
import { ReceivePaymentDialogComponent } from '../receive-payment-dialog/receive-payment-dialog.component';

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.css'],
})
export class AccountComponentComponent implements OnInit {
  privilege = GlobalComponent.privilege;
  dataSource = new MatTableDataSource<Account>();
  dataSourceReceipt = new MatTableDataSource<Receipt>();
  dataSourcePayments = new MatTableDataSource<payments>();
  @ViewChild('matSortAccounts') sortAccounts!: MatSort;
  @ViewChild('matSortReceipt') sortReceipt!: MatSort;
  @ViewChild('matSortPayments') sortPayments!: MatSort;
  @ViewChild('accountSearch') searchField!: ElementRef;

  constructor(
    private accountService: AccountService,
    private receiptService: ReceiptService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private changeDet: ChangeDetectorRef,
    public rounter: Router
  ) {}

  // When the component is loaded ngOnInit is executed
  ngOnInit(): void {
    this.refreshActiveAccountList();
  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit() {
    this.dataSource.sort = this.sortAccounts;
    this.dataSourceReceipt.sort = this.sortReceipt;
    this.dataSourcePayments.sort = this.sortPayments;
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }

  // -------------------------------------------------------------------------------------------------------------
  // Toggles function that shows inactive accounts or hides them
  showHide_Value = 'Show Inactive';
  showHideInactive() {
    if (this.showHide_Value == 'Show Inactive') {
      this.refreshInActiveAccountList();
      this.showHide_Value = 'Hide Inactive';
    } else {
      this.refreshActiveAccountList();
      this.showHide_Value = 'Show Inactive';
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Gets List of Active Accounts from the Database
  refreshActiveAccountList() {
    this.accountService.getAccountList('active').subscribe((accountData) => {
      this.dataSource.data = accountData;
    });
  }

  // Gets List of in-active Accounts from the Database
  refreshInActiveAccountList() {
    this.accountService.getAccountList('inactive').subscribe((accountData) => {
      accountData.forEach((data) => {
        this.dataSource.data.push(data);
        this.dataSource.data = this.dataSource.data;
      });
    });
  }

  displayedColumnsAccount: string[] = ['fullName', 'balance', 'menu'];
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Gets list of receipts based on the Account ID
  refreshAccountReceiptHistory(customerID: string) {
    this.receiptService
      .getReceiptsForAccount(customerID)
      .subscribe((receiptList) => {
        this.dataSourceReceipt.data = receiptList;
      });
  }
  displayedColumnsReceipt: string[] = [
    'receiptNumber',
    'date',
    'paymentMeth',
    'total',
    'menu',
  ];

  createReceipt() {
    this.rounter.navigate([
      '/dashboard/receipt/' + this.id + '/' + this.fullName + '/0',
    ]);
  }

  createInvoice() {
    this.rounter.navigate([
      '/dashboard/invoice/' + this.id + '/' + this.fullName + '/0',
    ]);
  }

  editReceiptBtn(data: Partial<Receipt>) {
    this.rounter.navigate(['/dashboard/receipt/0/new/' + data.id]);
  }

  viewReceipt(recData: Array<any>) {
    let printData = [recData];

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '450px';
    dialogConfig.data = printData;

    this.dialog
      .open(PrintReceiptDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log('Receipt Printed', val);
        }
      });
  }

  // Gets list of payments based on the Account ID
  refreshAccountPaymentHistory(customerID: string) {
    this.accountService
      .getPaymentsForAccount(customerID)
      .subscribe((paymentList) => {
        this.dataSourcePayments.data = paymentList;
      });
  }
  displayedColumnsPayment: string[] = [
    'paymentMethod',
    'reference',
    'date',
    'paymentAmount',
    'unappliedAmount',
    'memo',
    'menu',
  ];

  editPaymentBtn(data: Partial<payments>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.data = data;

    this.dialog
      .open(ReceivePaymentDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.refreshTable(true);
          this.refreshAccountPaymentHistory(this.id);
          this.showHide_Value = 'Show Inactive';
          this.openSnackBar('Payment Updated!', 'success-snakBar');
        } else {
          this.openSnackBar('Payment was not Saved!', 'error-snakBar');
        }
      });
  }

  viewPayment(paymentData: Partial<payments>) {
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
  }

  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Filters the data in the Accounts Table
  applyFilter(filterValue: any) {
    filterValue = filterValue.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Shows or Hides the Add Account Form
  show: boolean = false;
  icon: string = 'add';

  addAccountBtn() {
    this.show = !this.show;
    if (this.icon == 'add') {
      this.icon = 'close';
    } else {
      this.icon = 'add';
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Refresh Accounts Table with new DataSource
  refreshTable($event: any) {
    if ($event) {
      this.refreshActiveAccountList();
      this.showHide_Value = 'Show Inactive';
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // edits the account information and updates it in the database
  editAccountBtn(accountData: Account) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.data = accountData;

    this.dialog
      .open(EditAccountDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log('Account Edited', val);
          this.refreshTable(true);
          this.showHide_Value = 'Show Inactive';
          this.openSnackBar('Account Successfully Updated!', 'success-snakBar');
        } else {
          this.openSnackBar('Account Was Not Updated!', 'error-snakBar');
        }
      });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Opens dialog to receive payment from the customer
  receivePayment(accountData: Account) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.data = accountData;

    this.dialog
      .open(ReceivePaymentDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.refreshTable(true);
          this.refreshAccountPaymentHistory(this.id);
          this.showHide_Value = 'Show Inactive';
          this.openSnackBar('Payment Received!', 'success-snakBar');
        } else {
          this.openSnackBar('Payment was not Saved!', 'error-snakBar');
        }
      });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  id!: string;
  fullName!: string;
  phone!: string;
  email!: string;
  street!: string;
  city_town_village!: string;
  country!: string;
  balance!: number;
  status!: string;
  date!: string;

  // FIlls customer infromation so it's visible to user
  fillAccountInfo(customerData: Account) {
    this.id = customerData.id;
    this.fullName = customerData.fullName;
    this.phone = customerData.phone;
    this.email = customerData.email;
    this.street = customerData.street;
    this.city_town_village = customerData.city_town_village;
    this.country = customerData.country;
    this.balance = customerData.balance;
    this.status = customerData.status;
    this.date = customerData.date;

    this.refreshAccountReceiptHistory(this.id);
    this.refreshAccountPaymentHistory(this.id);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  //Displays message to the user
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -----------------------------------------------------------------------------------------------------------
}
