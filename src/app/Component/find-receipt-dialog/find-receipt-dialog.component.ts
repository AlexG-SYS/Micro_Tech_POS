import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { Account } from 'src/app/Data-Model/account';
import { Receipt } from 'src/app/Data-Model/receipt';
import { GlobalComponent } from 'src/app/global-component';
import { AccountService } from 'src/app/Services/account.service';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { PrintReceiptDialogComponent } from '../print-receipt-dialog/print-receipt-dialog.component';

@Component({
  selector: 'app-find-receipt-dialog',
  templateUrl: './find-receipt-dialog.component.html',
  styleUrls: ['./find-receipt-dialog.component.css'],
})
export class FindReceiptDialogComponent {
  dataSourceReceipt = new MatTableDataSource<Receipt>();
  privilege = GlobalComponent.privilege;
  receiptSearchField = new FormControl('');
  accountSearchField = new FormControl('');
  error = '';
  autoCompleteDataAccount: string[] = [];
  filteredOptionsAccount!: Observable<string[]>;
  accountsDataArray: Account[] = [];

  constructor(
    private dialogRef: MatDialogRef<FindReceiptDialogComponent>,
    private formB: FormBuilder,
    private receiptService: ReceiptService,
    private accountServicce: AccountService,
    public rounter: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.refreshActiveAccountList();
    this.filteredOptionsAccount = this.accountSearchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccount(value || ''))
    );
  }

  // -------------------------------------------------------------------------------------------------------------
  // Function returns the value if the filtered value is true
  // -------------------------------------------------------------------------------------------------------------
  private _filterAccount(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteDataAccount.filter((autoCompleteDataAccount) =>
      autoCompleteDataAccount.toLowerCase().includes(filterValue)
    );
  }
  // -------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------

  refreshActiveAccountList() {
    this.accountServicce.getAccountList('active').subscribe((accountData) => {
      accountData.forEach((account) => {
        this.accountsDataArray.push(account);
        this.autoCompleteDataAccount.push(account.fullName);
        this.autoCompleteDataAccount = this.autoCompleteDataAccount.sort(
          (n1, n2) => {
            if (n1 > n2) {
              return 1;
            }

            if (n1 < n2) {
              return -1;
            }

            return 0;
          }
        );
      });
    });
  }

  editReceiptBtn(data: Partial<Receipt>) {
    this.close();
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

  displayedColumnsReceipt: string[] = [
    'receiptNumber',
    'date',
    'paymentMeth',
    'total',
    'menu',
  ];

  // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Validates
  findReceiptByNum() {
    this.accountSearchField.reset();
    if (this.receiptSearchField.valid) {
      this.error = '';
      const formSearchValue = Number(this.receiptSearchField.value);

      this.receiptService
        .findReceiptWithNumber(formSearchValue)
        .subscribe((receiptList) => {
          if (receiptList[0] == null) {
            this.error = 'No Receipt Found*';
            this.dataSourceReceipt.data = receiptList;
          } else {
            this.dataSourceReceipt.data = receiptList;
          }
        });
    } else {
      this.error = 'Invalid Input*';
      this.receiptSearchField.reset();
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  findReceiptByName(searchValue: any) {
    this.receiptSearchField.reset();
    if (this.accountSearchField.valid) {
      this.error = '';
      let formSearchValue = '';

      if (searchValue == '') {
        formSearchValue = this.accountSearchField.value!;
      } else {
        this.accountsDataArray.forEach((account) => {
          if (account.fullName == searchValue.source.value) {
            formSearchValue = account.id;
          }
        });
      }

      this.receiptService
        .getReceiptsForAccount(formSearchValue!)
        .subscribe((receiptList) => {
          if (receiptList[0] == null) {
            this.error = 'No Receipt Found*';
            this.dataSourceReceipt.data = receiptList;
          } else {
            this.dataSourceReceipt.data = receiptList;
          }
        });
    } else {
      this.error = 'Invalid Input*';
      this.accountSearchField.reset();
    }
  }
}
