import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  QueryList,
} from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Items } from 'src/app/Data-Model/item';
import { Receipt } from 'src/app/Data-Model/receipt';
import { ItemService } from 'src/app/Services/item.service';
import { Observable } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { GlobalComponent } from 'src/app/global-component';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { AccountService } from 'src/app/Services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrintReceiptDialogComponent } from '../print-receipt-dialog/print-receipt-dialog.component';
import { END } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/Data-Model/account';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-receipt-component',
  templateUrl: './receipt-component.component.html',
  styleUrls: ['./receipt-component.component.css'],
})
export class ReceiptComponentComponent implements OnInit {
  @ViewChild('itemSearch') searchFieldItem!: ElementRef;
  @ViewChild('accountSearch') searchFieldAccount!: ElementRef;
  @ViewChildren(MatTable) tablesItems!: QueryList<Items>;
  accountID: string | null = '';
  accountName: string | null = '';
  accountPhone: string = '';
  accountEmail: string = '';
  accountStreet: string = '';
  accountCity_town_village: string = '';
  accountCountry: string = '';
  receiptDataSource: Items[] = [];
  receiptItems: Items[] = [];
  dataSource = new MatTableDataSource<Items>();
  itemSearchField = new FormControl('');
  accountSearchField = new FormControl('');
  discountField = new FormControl('');
  autoCompleteData: string[] = [];
  autoCompleteDataAccount: string[] = [];
  filteredOptions!: Observable<string[]>;
  filteredOptionsAccount!: Observable<string[]>;
  subTotal: number = 0;
  tax: number = 0;
  total: number = 0;
  discountPercentage: number = 0;
  discount: number = 0;
  change: number = 0;
  username: string = GlobalComponent.userName;
  itemList: Items[] = [];
  clicked = false;

  constructor(
    private itemService: ItemService,
    private receiptService: ReceiptService,
    private accountServicce: AccountService,
    private changeDet: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  // When the component is loaded ngOnInit is executed
  ngOnInit() {
    if (
      this.activatedRoute.snapshot.paramMap.get('accountID') == '0' &&
      this.activatedRoute.snapshot.paramMap.get('accountName') == 'new'
    ) {
      this.accountID = '';
      this.accountName = '';
    } else {
      this.accountID = this.activatedRoute.snapshot.paramMap.get('accountID');
      this.accountName =
        this.activatedRoute.snapshot.paramMap.get('accountName');
      this.accountServicce
        .getAccount(this.accountID)
        .subscribe((accountData) => {
          const customerInfo: any = accountData.data();

          this.accountPhone = customerInfo.phone;
          this.accountStreet = customerInfo.street;
          this.accountCity_town_village = customerInfo.city_town_village;
          this.accountCountry = customerInfo.country;
        });
    }

    this.paymentMethod(0);
    this.refreshActiveItemList();
    this.filteredOptions = this.itemSearchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.refreshActiveAccountList();
    this.filteredOptionsAccount = this.accountSearchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccount(value || ''))
    );
  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit(): void {
    this.searchFieldAccount.nativeElement.focus();
    this.changeDet.detectChanges();
  }

  // -------------------------------------------------------------------------------------------------------------
  // Function returns the value if the filtered value is true
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteData.filter((autoCompleteData) =>
      autoCompleteData.toLowerCase().includes(filterValue)
    );
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  private _filterAccount(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteDataAccount.filter((autoCompleteDataAccount) =>
      autoCompleteDataAccount.toLowerCase().includes(filterValue)
    );
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Gets List of Items from the Database
  activeItemList!: any;

  refreshActiveItemList() {
    this.itemService.getItemList('active').subscribe((itemsData) => {
      this.itemList = itemsData;
    });

    this.itemService.getItemList('active').subscribe((itemsData) => {
      this.receiptDataSource = itemsData;

      this.receiptDataSource.forEach((item: any) => {
        delete item.online;
        delete item.date;
        delete item.mpn;
        delete item.status;
      });

      itemsData.forEach((item) => {
        this.autoCompleteData.push(
          item.upc + ': ' + item.description + ': ' + item.size
        );
        this.autoCompleteData = this.autoCompleteData.sort((n1, n2) => {
          if (n1 > n2) {
            return 1;
          }

          if (n1 < n2) {
            return -1;
          }

          return 0;
        });
      });
    });
    // this.itemService.getItem("active").subscribe(val => console.log(val));
  }

  displayedColumns: string[] = [
    'UPC',
    'Description',
    'Size',
    'Qty',
    'Price',
    'Remove',
  ];
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------

  refreshActiveAccountList() {
    this.accountServicce.getAccountList('active').subscribe((accountData) => {
      accountData.forEach((account) => {
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

  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Adds item to the Receipt Object
  addToReceipt(item: any) {
    let itemQty = 0;

    if (item.source.selected) {
      const itemUPC = item.source.value.split(':', 1);

      if (!this.isItemInReceipt(itemUPC)) {
        this.receiptDataSource.forEach((items) => {
          if (items.upc == itemUPC[0]) {
            this.itemList.forEach((element) => {
              if (element.upc == items.upc) {
                itemQty = element.quantity;
              }
            });

            if (itemQty > 0) {
              items.quantity = 1;
              this.receiptItems.push(items);
              this.error = '';
            } else {
              this.error = items.description + ': Insufficient quantity';
              return;
            }
          }
        });
      }

      this.itemSearchField.reset();
    }
    this.dataSource.data = this.receiptItems;
    this.discountChange(this.discountPercentage);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------

  addAccountToReceipt(account: any) {
    const accountName = account.source.value.split(':', 1);
    this.accountServicce
      .getAccountWithName(accountName[0])
      .subscribe((accountData) => {
        const customerInfo = accountData[0];
        this.accountID = customerInfo.id;
        this.accountName = customerInfo.fullName;
        this.accountPhone = customerInfo.phone;
        this.accountStreet = customerInfo.street;
        this.accountCity_town_village = customerInfo.city_town_village;
        this.accountCountry = customerInfo.country;
      });

    this.accountSearchField.reset();
  }

  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Increases the Qty if the Item
  increaseQty(itemID: string) {
    let itemQty = 0;

    this.itemList.forEach((element) => {
      if (element.id == itemID) {
        itemQty = element.quantity;
      }
    });

    this.receiptItems.forEach((item) => {
      if (item.id == itemID && itemQty > item.quantity) {
        item.quantity++;
        this.error = '';
      } else {
        let qty = item.quantity;
        if (item.id == itemID && itemQty < ++qty) {
          this.error = item.description + ': Insufficient quantity';
          return;
        }
      }
    });
    this.discountChange(this.discountPercentage);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Decreases the Qty if the Item
  decreaseQty(itemID: string) {
    this.receiptItems.forEach((item) => {
      if (item.id == itemID && item.quantity > 0) {
        item.quantity--;
        this.error = '';
      } else {
        let qty = item.quantity;
        if (item.id == itemID && --qty < 0) {
          this.error = item.description + ': Insufficient quantity';
          return;
        }
      }
    });

    this.discountChange(this.discountPercentage);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Removes the item from the Receipt
  removeItem(index: number) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
    this.discountChange(this.discountPercentage);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Calcualtes the Total, Subtoal and Tax
  updateTotal() {
    this.total = 0;
    this.subTotal = 0;
    this.tax = 0;
    this.receiptItems.forEach((item) => {
      if (item.tax == true) {
        this.tax = item.quantity * item.itemTax + this.tax;
      }
      this.subTotal = item.quantity * item.itemSubTotal + this.subTotal;
      this.total = item.quantity * item.price + this.total;
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  //calculates disocunt and re-calculates total, subtotal and Tax
  discountChange(discountValue: number) {
    const discountLimit = GlobalComponent.discountLimit;

    if (discountValue > 0 && discountValue <= discountLimit) {
      this.error = '';
      this.discountPercentage = discountValue;
      this.subTotal = 0;
      this.tax = 0;
      this.discount = 0;

      this.receiptItems.forEach((item) => {
        this.discount =
          this.discount +
          item.quantity * (item.itemSubTotal * (this.discountPercentage / 100));

        this.subTotal =
          this.subTotal +
          item.quantity *
            (item.itemSubTotal -
              item.itemSubTotal * (this.discountPercentage / 100));

        if (item.tax == true) {
          this.tax =
            this.tax +
            0.125 *
              (item.quantity *
                (item.itemSubTotal -
                  item.itemSubTotal * (this.discountPercentage / 100)));
        }
      });
      this.total = this.subTotal + this.tax;
    } else if (discountValue >= discountLimit || discountValue < 0) {
      this.error = 'User Discount Limit is: ' + discountLimit + '%';
    } else {
      this.discountPercentage = 0;
      this.discount = 0;
      this.updateTotal();
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Selects the Payment Method
  pymMethod: string = '';
  paymentMethod(index: number) {
    const pmtMethod = document.querySelectorAll('.payment-method-Btn');
    pmtMethod.forEach((element) => {
      element.classList.remove('active');
    });
    pmtMethod[index].classList.add('active');
    this.pymMethod = pmtMethod[index].id.toString();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Resets the Entire Receipt component
  resetReceipt() {
    this.dataSource.data = [];
    this.receiptItems = [];
    this.dataSource.data = this.dataSource.data;
    this.error = '';
    this.paymentMethod(0);
    this.updateTotal();

    this.accountID = '';
    this.accountName = '';
    this.accountPhone = '';
    this.accountStreet = '';
    this.accountCity_town_village = '';
    this.accountCountry = '';
    this.discountPercentage = 0;
    this.discount = 0;
    this.discountField.reset();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Addes the Receipt Object to the Datbase
  receipt: Partial<Receipt> = {};
  error = '';

  receiptItemSubmit(formData: NgForm) {
    this.clicked = true;
    this.subTotal = parseFloat(this.subTotal.toFixed(2));
    this.discount = parseFloat(this.discount.toFixed(2));
    this.tax = parseFloat(this.tax.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));

    if (this.receiptItems.length < 1) {
      this.error = 'Receipt is Empty*';
      this.clicked = false;
      return;
    }
    if (this.pymMethod.length < 1) {
      this.error = 'Payment Method is Empty*';
      this.clicked = false;
      return;
    }
    if (this.accountID == undefined || this.accountID.length < 1) {
      this.error = 'No Customer Selected*';
      this.clicked = false;
      return;
    }
    if (!formData.valid || formData.value.tendered < this.total) {
      this.error = 'Tendered Amount is Insufficient*';
      this.clicked = false;
      return;
    } else {
      this.change = formData.value.tendered - this.total;
      this.receipt.customerID = this.accountID?.toString();
      this.receipt.customerName = this.accountName?.toString();
      this.receipt.date = new Date().toLocaleDateString();
      this.receipt.items = this.receiptItems;
      this.receipt.subtotal = this.subTotal;
      this.receipt.discountPercentage = this.discountPercentage;
      this.receipt.discount = this.discount;
      this.receipt.TAX = this.tax;
      this.receipt.total = this.total;
      this.receipt.paymentMeth = this.pymMethod;
      this.receipt.salesRep = this.username;
      this.receipt.reference = formData.value.reference;
      this.receipt.change = this.change;
      this.receipt.memo =
        'Thank you for Choosing ' +
        GlobalComponent.companyName.toUpperCase() +
        '!';

      this.receiptService
        .addReceipt(this.receipt)
        .pipe(
          tap((receipt) => {
            receipt.subscribe((rec) => {
              this.itemList.forEach((item) => {
                this.receipt.items?.forEach((recItem) => {
                  if (recItem.id == item.id) {
                    if (recItem.quantity != undefined) {
                      item.quantity = item.quantity - recItem.quantity;
                      this.itemService.updateItem(recItem.id, item);
                    }
                  }
                });
              });

              console.log('Receipt Successfully Added! ID:', rec.id);
              this.resetReceipt();
              formData.resetForm();

              this.filteredOptions = this.itemSearchField.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
              );
              this.openSnackBar(
                'Receipt Successfully Saved!',
                'success-snakBar'
              );

              let printData = [rec];
              this.openPrintDialog(printData);
              this.clicked = false;
            });
          }),
          catchError((error) => {
            this.openSnackBar(
              'An Error Occured While Saving!',
              'error-snakBar'
            );
            throw catchError(error);
          })
        )
        .subscribe();
    }
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

  // -------------------------------------------------------------------------------------------------------------
  // Opens the Print Dialog and passes the data for the print receipt function
  openPrintDialog(data: Array<any>) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '350px';
    dialogConfig.data = data;

    this.dialog
      .open(PrintReceiptDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log('Receipt Printed', val);
        }
      });
  }
  // -------------------------------------------------------------------------------------------------------------

  isItemInReceipt(upc: string): boolean {
    let result = false;

    this.receiptItems.forEach((item) => {
      if (item.upc == upc) {
        this.increaseQty(item.id);
        result = true;
      }
    });

    return result;
  }
}
