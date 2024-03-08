import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  QueryList,
} from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
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
import { ActivatedRoute, Router } from '@angular/router';
import { FindReceiptDialogComponent } from '../find-receipt-dialog/find-receipt-dialog.component';
import { Account } from 'src/app/Data-Model/account';

@Component({
  selector: 'app-receipt-component',
  templateUrl: './receipt-component.component.html',
  styleUrls: ['./receipt-component.component.css'],
})
export class ReceiptComponentComponent implements OnInit {
  // ViewChild and ViewChildren decorators to access DOM elements
  @ViewChild('itemSearch') searchFieldItem!: ElementRef;
  @ViewChild('accountSearch') searchFieldAccount!: ElementRef;
  @ViewChildren(MatTable) tablesItems!: QueryList<Items>;

  // Component properties
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
  tenderedField = new FormControl('', Validators.required);
  referenceField = new FormControl('');
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
  date: string = '';
  username: string = GlobalComponent.userName;
  itemList: Items[] = [];
  editReceiptID: string = '';
  editReceiptItems: Items[] = [];
  receiptNumber!: number;
  accountsDataArray: Account[] = [];
  clicked = false;
  isLoading = false;
  recEdit = false;

  displayedColumns: string[] = [
    'UPC',
    'Description',
    'Size',
    'Qty',
    'Price',
    'Remove',
  ];

  // -------------------------------------------------------------------------------------------------------------
  // Constructor initializes services and dependencies
  constructor(
    private itemService: ItemService,
    private receiptService: ReceiptService,
    private accountServicce: AccountService,
    private changeDet: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public rounter: Router
  ) {}
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Lifecycle hook called when the component is initialized
  ngOnInit() {
    // Initialize component properties and load data
    this.refreshActiveAccountList();
    this.initializeData();
    this.refreshActiveItemList();
    this.setupAutocompleteFields();
    this.paymentMethod(0);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Lifecycle hook called after the view is initialized
  ngAfterViewInit(): void {
    this.adjustFocusAndChangeDetection();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Function to filter autocomplete data for items
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteData.filter((autoCompleteData) =>
      autoCompleteData.toLowerCase().includes(filterValue)
    );
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Function to filter autocomplete data for accounts
  private _filterAccount(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteDataAccount.filter((autoCompleteDataAccount) =>
      autoCompleteDataAccount.toLowerCase().includes(filterValue)
    );
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  private initializeData(): void {
    // ... (logic to initialize data)
    if (
      this.activatedRoute.snapshot.paramMap.get('accountID') == '0' &&
      this.activatedRoute.snapshot.paramMap.get('accountName') == 'new' &&
      this.activatedRoute.snapshot.paramMap.get('receiptID') == '0'
    ) {
      this.accountID = '';
      this.accountName = '';
      this.setReceiptNumberValue();
    } else if (this.activatedRoute.snapshot.paramMap.get('accountID') != '0') {
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
    } else if (this.activatedRoute.snapshot.paramMap.get('receiptID') != '0') {
      this.editReceiptID =
        this.activatedRoute.snapshot.paramMap.get('receiptID')!;

        this.recEdit = true;
      
      this.receiptService
        .findReceipt(this.editReceiptID)
        .subscribe((recData) => {
          const tempRecData: any = recData.data();

          this.addAccountToReceipt(tempRecData.customerName);

          tempRecData.items.forEach((item: any) => {
            this.addToEditReceipt(item);
          });

          this.discountField.setValue(tempRecData.discountPercentage);
          this.discountChange(tempRecData.discountPercentage);

          switch (tempRecData.paymentMeth) {
            case 'Cash':
              this.paymentMethod(0);
              break;
            case 'Card':
              this.paymentMethod(1);
              break;
            case 'Cheque':
              this.paymentMethod(2);
              break;
            case 'E-Wallet':
              this.paymentMethod(3);
              break;
            case 'Gift Card':
              this.paymentMethod(4);
              break;
            case 'Direct To Bank':
              this.paymentMethod(5);
              break;
            default:
              this.paymentMethod(0);
              break;
          }

          this.tenderedField.setValue(tempRecData.total + tempRecData.change);
          this.referenceField.setValue(tempRecData.reference);
          this.receiptNumber = tempRecData.receiptNumber;
          this.date = tempRecData.date;

          // Before adding items to this.editReceiptItems, create a deep copy of each item
          tempRecData.items.forEach((item: any) => {
            const deepCopiedItem = JSON.parse(JSON.stringify(item));
            this.editReceiptItems.push(deepCopiedItem);
          });
        });
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  activeItemList!: any;
  // Load active items from the database
  private refreshActiveItemList() {
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
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  private setupAutocompleteFields(): void {
    // Set up observables for autocomplete fields
    this.filteredOptions = this.itemSearchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.filteredOptionsAccount = this.accountSearchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccount(value || ''))
    );
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  private adjustFocusAndChangeDetection(): void {
    // Update focus and detect changes in the view
    if (this.editReceiptID != '') {
      this.searchFieldAccount.nativeElement.blur();
    } else {
      this.searchFieldAccount.nativeElement.focus();
    }
    this.changeDet.detectChanges();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Load active accounts from the database
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
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Add item to the receipt
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
  addToEditReceipt(item: Items) {
    this.receiptItems.push(item);

    this.itemSearchField.reset();

    this.dataSource.data = this.receiptItems;
    this.discountChange(this.discountPercentage);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  addAccountToReceipt(account: any) {
    let accountName: string;
    if (typeof account === 'string') {
      accountName = account;
    } else {
      accountName = account.source.value;
    }

    this.accountsDataArray.forEach((account) => {
      if (account.fullName == accountName) {
        this.accountID = account.id;
        this.accountName = account.fullName;
        this.accountPhone = account.phone;
        this.accountStreet = account.street;
        this.accountCity_town_village = account.city_town_village;
        this.accountCountry = account.country;
      }
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
  // Calculate and update total, subtotal, and tax
  updateTotal() {
    this.total = 0;
    this.subTotal = 0;
    this.tax = 0;
    this.receiptItems.forEach((item) => {
      if (item.tax == true) {
        this.tax = ((item.quantity * item.price)*0.125) + this.tax;
      }
      this.subTotal = item.quantity * item.price + this.subTotal;
      this.total = item.quantity * item.price + this.total;
    });
    this.total = this.tax + this.total;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handle discount change
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
          item.quantity * (item.price * (this.discountPercentage / 100));

        this.subTotal =
          this.subTotal +
          item.quantity *
            (item.price -
              item.price * (this.discountPercentage / 100));

        if (item.tax == true) {
          this.tax =
            this.tax +
            0.125 *
              (item.quantity *
                (item.price -
                  item.price * (this.discountPercentage / 100)));
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
  // Reset the receipt
  resetReceipt() {
    this.dataSource.data = [];
    this.receiptItems = [];
    this.dataSource.data = this.dataSource.data;
    this.error = '';
    this.paymentMethod(0);
    this.updateTotal();
    this.editReceiptID = '';
    this.accountID = '';
    this.accountName = '';
    this.accountPhone = '';
    this.accountStreet = '';
    this.accountCity_town_village = '';
    this.accountCountry = '';
    this.discountPercentage = 0;
    this.discount = 0;
    this.discountField.reset();
    this.tenderedField.reset();
    this.referenceField.reset();
    this.setReceiptNumberValue();
    this.rounter.navigate(['/dashboard/receipt/0/new/0']);
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Submit receipt data
  receipt: Partial<Receipt> = {};
  error = '';

  receiptItemSubmit() {
    let tendered = +this.tenderedField.value!;
    this.clicked = true;
    this.isLoading = true;
    this.subTotal = parseFloat(this.subTotal.toFixed(2));
    this.discount = parseFloat(this.discount.toFixed(2));
    this.tax = parseFloat(this.tax.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));

    if (this.receiptItems.length < 1) {
      this.error = 'Receipt is Empty*';
      this.clicked = false;
      this.isLoading = false;
      return;
    }
    if (this.pymMethod.length < 1) {
      this.error = 'Payment Method is Empty*';
      this.clicked = false;
      this.isLoading = false;
      return;
    }
    if (this.accountID == undefined || this.accountID.length < 1) {
      this.error = 'No Customer Selected*';
      this.clicked = false;
      this.isLoading = false;
      return;
    }
    if (!this.tenderedField.valid || tendered < this.total) {
      this.error = 'Tendered Amount is Insufficient*';
      this.clicked = false;
      this.isLoading = false;
      return;
    } else {
      this.change = tendered - this.total;
      this.change = parseFloat(this.change.toFixed(2));
      this.receipt.customerID = this.accountID?.toString();
      this.receipt.customerName = this.accountName?.toString();
      this.receipt.items = this.receiptItems;
      this.receipt.subtotal = this.subTotal;
      this.receipt.discountPercentage = this.discountPercentage;
      this.receipt.discount = this.discount;
      this.receipt.TAX = this.tax;
      this.receipt.total = this.total;
      this.receipt.paymentMeth = this.pymMethod;
      this.receipt.salesRep = this.username;
      this.receipt.reference = this.referenceField.value!;
      this.receipt.change = this.change;
      this.receipt.memo =
        'Thank you for Choosing ' +
        GlobalComponent.companyName.toUpperCase() +
        '!';

      if (this.editReceiptID) {
        this.receipt.date = this.date;
        this.receipt.receiptNumber = this.receiptNumber;
        this.receiptService
          .editReceipt(this.editReceiptID, this.receipt)
          .subscribe(() => {
            // Iterate through receipt items and update corresponding database items
            this.receipt.items?.forEach((recItem) => {
              const itemToUpdate = this.itemList.find(
                (item) => item.id === recItem.id
              );
              if (itemToUpdate && recItem.quantity !== undefined) {
                itemToUpdate.quantity =
                  itemToUpdate.quantity +
                  this.getEditReceiptItemQuantity(recItem.id || '') -
                  recItem.quantity;
                this.itemService
                  .updateItem(itemToUpdate.id, itemToUpdate)
                  .subscribe();
              }
            });

            console.log(
              'Receipt Successfully Updated! ID:',
              this.editReceiptID
            );

            this.recEdit = false;

            this.resetReceipt();
            this.openSnackBar('Receipt Updated!', 'success-snakBar');

            let printData = [this.receipt];
            this.openPrintDialog(printData);
            this.clicked = false;
            this.isLoading = false;
          });
      } else {
        this.receipt.date = new Date().toLocaleDateString();
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

                this.filteredOptions = this.itemSearchField.valueChanges.pipe(
                  startWith(''),
                  map((value) => this._filter(value || ''))
                );

                this.resetReceipt();
                this.openSnackBar(
                  'Receipt Successfully Saved!',
                  'success-snakBar'
                );

                let printData = [rec];
                this.openPrintDialog(printData);
                this.clicked = false;
                this.isLoading = false;
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
  }
  // -------------------------------------------------------------------------------------------------------------

  // Helper function to get the quantity of an item in the editReceiptItems array
  getEditReceiptItemQuantity(itemId: string): number {
    const item = this.editReceiptItems.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  }

  // -----------------------------------------------------------------------------------------------------------
  // Display snackbar message
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
          console.log('Receipt Printed');
        }
      });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Check if an item is already in the receipt
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
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Set receipt number value
  private setReceiptNumberValue() {
    this.receiptService.lastReceiptNum().subscribe((lastRecID) => {
      this.receiptNumber = lastRecID + 1;
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Open find receipt dialog
  findReceipt() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '350px';

    this.dialog
      .open(FindReceiptDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log('Receipt Found');
        }
      });
  }
  // -------------------------------------------------------------------------------------------------------------
}
