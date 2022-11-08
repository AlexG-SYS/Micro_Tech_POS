import { Component, ElementRef, OnInit, ViewChild, ViewChildren, ChangeDetectorRef, QueryList } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Items } from 'src/app/Data-Model/item';
import { Receipt } from 'src/app/Data-Model/receipt';
import { ItemService } from 'src/app/Services/item.service';
import { Observable } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { GlobalComponent } from 'src/app/global-component';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrintReceiptDialogComponent } from '../print-receipt-dialog/print-receipt-dialog.component';
import { END } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-receipt-component',
  templateUrl: './receipt-component.component.html',
  styleUrls: ['./receipt-component.component.css']
})
export class ReceiptComponentComponent implements OnInit {

  @ViewChild("itemSearch") searchField!: ElementRef;
  @ViewChildren(MatTable) tablesItems!: QueryList<Items>;
  receiptDataSource: Items[] = [];
  receiptItems: Items[] = [];
  dataSource = new MatTableDataSource<Items>;
  itemSearchField = new FormControl('');
  autoCompleteData: string[] = [];
  filteredOptions!: Observable<string[]>;
  subTotal: number = 0;
  tax: number = 0;
  total: number = 0;
  change: number = 0;
  username: string = GlobalComponent.userName;
  privilege: string = GlobalComponent.privilege;
  itemList: Items[] = [];

  constructor(private itemService: ItemService, private receiptService: ReceiptService,
    private changeDet: ChangeDetectorRef, private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  // When the component is loaded ngOnInit is executed
  ngOnInit() {
    this.paymentMethod(0);
    this.refreshActiveItemList();
    this.filteredOptions = this.itemSearchField.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit(): void {
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }

  // -------------------------------------------------------------------------------------------------------------
  // Function returns the value if the filtered value is true
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autoCompleteData.filter(autoCompleteData => autoCompleteData.toLowerCase().includes(filterValue));
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Gets List of Items from the Database
  activeItemList!: any;

  refreshActiveItemList() {
    this.itemService.getItemList("active").subscribe(itemsData => {
      this.itemList = itemsData;
    });

    this.itemService.getItemList("active").subscribe(itemsData => {

      this.receiptDataSource = itemsData;

      this.receiptDataSource.forEach((item: any) => {
        delete item.online;
        delete item.date;
        delete item.mpn;
        delete item.status;
      });

      itemsData.forEach(item => {
        this.autoCompleteData.push(item.upc + ": " + item.description);
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

  displayedColumns: string[] = ['UPC', 'Description', 'Qty', 'Price', 'Remove'];

  // -------------------------------------------------------------------------------------------------------------
  // Adds item to the Receipt Object
  addToReceipt(item: any) {
    let itemQty = 0;

    if (item.source.selected) {
      const itemUPC = item.source.value.split(':', 1)

      if(!this.isItemInReceipt(itemUPC)){
        this.receiptDataSource.forEach(items => {
          if (items.upc == itemUPC[0]) {
  
            this.itemList.forEach(element => {
              if (element.upc == items.upc) {
                itemQty = element.quantity;
              }
            });
  
            if (itemQty > 0) {
              items.quantity = 1;
              this.receiptItems.push(items);
              this.error = "";
            }
            else {
              this.error = items.description + ": Insufficient quantity";
              return;
            }
          }
        })
      }

      this.itemSearchField.reset();
    }
    this.dataSource.data = this.receiptItems;
    this.updateTotal();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Increases the Qty if the Item
  increaseQty(itemID: string) {
    let itemQty = 0;

    this.itemList.forEach(element => {
      if (element.id == itemID) {
        itemQty = element.quantity;
      }
    });

    this.receiptItems.forEach(item => {

      if (item.id == itemID && itemQty > item.quantity) {
        item.quantity++;
        this.error = "";
      }
      else {
        let qty = item.quantity;
        if (item.id == itemID && itemQty < ++qty) {
          this.error = item.description + ": Insufficient quantity";
          return;
        }
      }
    })
    this.updateTotal();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Decreases the Qty if the Item
  decreaseQty(itemID: string) {
    this.receiptItems.forEach(item => {
      if (item.id == itemID && item.quantity > 0) {
        item.quantity--;
        this.error = "";
      }
      else {
        let qty = item.quantity;
        if (item.id == itemID && --qty < 0) {
          this.error = item.description + ": Insufficient quantity";
          return;
        }
      }
    })

    this.updateTotal();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Removes the item from the Receipt
  removeItem(index: number) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
    this.updateTotal();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Calcualtes the Total, Subtoal and Tax
  updateTotal() {
    this.total = 0;
    this.receiptItems.forEach(item => {
      this.total = (item.quantity * item.price) + this.total;
    })
    this.tax = (this.total * 0.125);
    this.subTotal = this.total - this.tax;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Selects the Payment Method
  pymMethod: string = "";
  paymentMethod(index: number) {
    const pmtMethod = document.querySelectorAll('.payment-method-Btn');
    pmtMethod.forEach(element => {
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
    this.error = "";
    this.paymentMethod(0);
    this.updateTotal();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Addes the Receipt Object to the Datbase
  receipt: Partial<Receipt> = {};
  error = "";

  receiptItemSubmit(formData: NgForm) {

    if (this.receiptItems.length < 1) {
      this.error = "Receipt is Empty.";
      return;
    }
    if (this.pymMethod.length < 1) {
      this.error = "Payment Method is Empty.";
      return;
    }
    if (!formData.valid || formData.value.tendered < this.total) {
      this.error = "Tendered Amount is Insufficient.";
      return;
    }

    else {

      this.change = (formData.value.tendered - this.total);
      this.receipt.customerName = "BMP " + this.pymMethod + " Customer"
      this.receipt.date = new Date().toLocaleDateString();
      this.receipt.items = this.receiptItems;
      this.receipt.total = this.total;
      this.receipt.paymentMeth = this.pymMethod;
      this.receipt.memo = "Thank you for Choosing " + GlobalComponent.companyName.toUpperCase() + "!";

      this.receiptService.addReceipt(this.receipt)
        .pipe(
          tap(receipt => {
            receipt.subscribe(rec => {


              this.itemList.forEach(item => {
                this.receipt.items?.forEach(recItem => {
                  if (recItem.id == item.id) {
                    if (recItem.quantity != undefined) {
                      item.quantity = item.quantity - recItem.quantity;
                      this.itemService.updateItem(recItem.id, item)
                    }
                  }
                })
              });

              console.log("Receipt Successfully Added! ID:", rec.id);
              this.resetReceipt();
              formData.resetForm();

              this.refreshActiveItemList();

              this.filteredOptions = this.itemSearchField.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
              );
              this.openSnackBar('Receipt Successfully Saved!', 'success-snakBar');

              let printData = [this.change, rec];
              this.openPrintDialog(printData);
            })

          }),
          catchError(error => {
            this.openSnackBar('An Error Occured While Saving!', 'error-snakBar');
            throw catchError(error);
          })).subscribe();
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
    dialogConfig.minWidth = "350px";
    dialogConfig.data = data;

    this.dialog.open(PrintReceiptDialogComponent, dialogConfig)
      .afterClosed().subscribe(val => {
        if (val) {
          console.log("Receipt Printed", val);
        }
      })
  }
  // -------------------------------------------------------------------------------------------------------------

  isItemInReceipt(upc: string): boolean{
    let result: boolean = false;
    
    this.receiptItems.forEach( item => {
      if(item.upc == upc){
        this.increaseQty(item.id);
        result = true;
      }
      else {
        result = false;
      }
    })

    return result;
  }
}
