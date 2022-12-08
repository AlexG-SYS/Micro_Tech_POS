import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Account } from 'src/app/Data-Model/account';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.component.html',
  styleUrls: ['./account-component.component.css']
})
export class AccountComponentComponent implements OnInit {

  privilege = GlobalComponent.privilege;
  dataSource = new MatTableDataSource<Account>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("accountSearch") searchField!: ElementRef;

  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private dialog: MatDialog,
    private changeDet: ChangeDetectorRef) {
  }

  // When the component is loaded ngOnInit is executed
  ngOnInit(): void {
    this.refreshActiveAccountList();
  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }

  // -------------------------------------------------------------------------------------------------------------
  // Toggles function that shows inactive accounts or hides them
  showHide_Value = "Show Inactive";
  showHideInactive() {
    if (this.showHide_Value == "Show Inactive") {
      this.refreshInActiveAccountList();
      this.showHide_Value = "Hide Inactive";
    }
    else {
      this.refreshActiveAccountList();
      this.showHide_Value = "Show Inactive";
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Gets List of Accounts from the Database

  refreshActiveAccountList() {
    this.accountService.getAccountList("active").subscribe(accountData => {
      this.dataSource.data = accountData;
    });
    // this.accountService.getAccountList("active").subscribe(val => console.log(val));
  }

  refreshInActiveAccountList() {
    this.accountService.getAccountList("inactive").subscribe(accountData => {
      accountData.forEach(data => {
        this.dataSource.data.push(data);
        this.dataSource.data = this.dataSource.data;
      });
    });
  }

  displayedColumns: string[] = ['name', 'balance'];
  // -------------------------------------------------------------------------------------------------------------

  // Filters the data in the Accounts Table 
  applyFilter(filterValue: any) {
    filterValue = filterValue.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // -------------------------------------------------------------------------------------------------------------
  // Shows or Hides the Add Account Form
  show: boolean = false;
  icon: string = 'add';

  addAccountBtn() {
    this.show = !this.show;
    if (this.icon == 'add') {
      this.icon = 'close'
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
      this.showHide_Value = "Show Inactive";
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  editAccountBtn(accountData: Account) {

  }

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
  }

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
