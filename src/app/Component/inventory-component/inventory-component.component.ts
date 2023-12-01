import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from '../../Services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditItemDialogComponent } from '../edit-item-dialog/edit-item-dialog.component';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-inventory-component',
  templateUrl: './inventory-component.component.html',
  styleUrls: ['./inventory-component.component.css'],
})
export class InventoryComponentComponent implements OnInit {
  // Privilege and data source for items
  privilege = GlobalComponent.privilege;
  dataSource = new MatTableDataSource<Items>();
  isLoading = false;

  // ViewChild for MatPaginator, MatSort, and searchField
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('itemSearch') searchField!: ElementRef;

  // Displayed columns for the table
  displayedColumns: string[] = [
    'upc',
    'description',
    'price',
    'quantity',
    'size',
    'online',
    'menu',
  ];

  // -----------------------------------------------------------------------------------------------------------
  // Constructor
  constructor(
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private changeDet: ChangeDetectorRef
  ) {}
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // When the component is loaded
  ngOnInit(): void {
    this.refreshActiveItemList();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // When the component view has been shown
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Toggles function to show/hide inactive items
  showHide_Value = 'Show Inactive';
  showHideInactive() {
    if (this.showHide_Value == 'Show Inactive') {
      this.refreshInActiveItemList();
      this.showHide_Value = 'Hide Inactive';
    } else {
      this.refreshActiveItemList();
      this.showHide_Value = 'Show Inactive';
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Refreshes the list of active items
  refreshActiveItemList() {
    this.isLoading = true;

    this.itemService.getItemList('active').subscribe((itemsData) => {
      this.dataSource.data = itemsData;
    });

    this.delayProgress();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Refreshes the list of inactive items
  refreshInActiveItemList() {
    this.isLoading = true;

    this.itemService.getItemList('inactive').subscribe((itemsData) => {
      this.dataSource.data = this.dataSource.data.concat(itemsData);
    });

    this.delayProgress();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Applies a filter to the data in the Item Table
  applyFilter(filterValue: any) {
    const value = filterValue.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Shows or Hides the Add Item Form
  show: boolean = false;
  icon: string = 'add';

  addItemBtn() {
    this.show = !this.show;
    this.icon = this.show ? 'close' : 'add';
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Refreshes the table after editing
  refreshTable() {
    this.refreshActiveItemList();
    this.showHide_Value = 'Show Inactive';
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Edit selected Item
  editItemBtn(itemData: Items) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.data = itemData;

    this.dialog
      .open(EditItemDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          console.log('Item Edited', val.id);
          this.refreshTable();
          this.showHide_Value = 'Show Inactive';
          this.openSnackBar('Item Successfully Updated!', 'success-snakBar');
        } else {
          this.openSnackBar('Item Was Not Updated!', 'error-snakBar');
        }
      });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Displays a message to the user using MatSnackBar
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  delayProgress() {
    setTimeout(() => {
      this.isLoading = false;
    },1000);
  }
}
