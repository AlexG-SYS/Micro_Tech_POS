import { Component, OnInit, ViewChild } from '@angular/core';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from '../../Services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditItemDialogComponent } from '../edit-item-dialog/edit-item-dialog.component';

@Component({
  selector: 'app-inventory-component',
  templateUrl: './inventory-component.component.html',
  styleUrls: ['./inventory-component.component.css']
})
export class InventoryComponentComponent implements OnInit {

  dataSource = new MatTableDataSource<Items>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) itemsTable!: MatTable<Element>;

  constructor(private itemService: ItemService, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  // When the component is loaded ngOnInit is executed
  ngOnInit(): void {
    this.refreshActiveItemList();
  }

  // When the component view has been shown ngAfterViewInit is executed
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // -------------------------------------------------------------------------------------------------------------
  // Toggles function that shows inactive items or hides them
  showHide_Value = "Show Inactive";
  showHideInactive(){
    if(this.showHide_Value == "Show Inactive"){
      this.refreshInActiveItemList();
      this.showHide_Value = "Hide Inactive";
    }
    else{
      this.refreshActiveItemList();
      this.showHide_Value = "Show Inactive";
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  
  // -------------------------------------------------------------------------------------------------------------
  // Gets List of Items from the Database
  activeItemList!: any;
  inactiveItemList!: any;

  refreshActiveItemList() {
    this.itemService.getItem("active").subscribe(itemsData => {
      this.dataSource.data = itemsData;
    });
    // this.itemService.getItem("active").subscribe(val => console.log(val));
  }

  refreshInActiveItemList() {
    this.itemService.getItem("inactive").subscribe(itemsData => {
      itemsData.forEach(data => {
        this.dataSource.data.push(data);
        this.dataSource.data = this.dataSource.data;
      });
    });
  }

  displayedColumns: string[] = ['upc', 'description', 'price', 'quantity', 'mpn', 'online', 'menu'];
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Filters the data in the Item Table 
  applyFilter(filterValue: any) {
    filterValue = filterValue.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Shows or Hides the Add Item Form
  show: boolean = false;
  icon: string = 'add';

  addItemBtn() {
    this.show = !this.show;
    if (this.icon == 'add') {
      this.icon = 'close'
    } else {
      this.icon = 'add';
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Refresh Item Table with new DataSource
  refreshTable($event: any){
    if($event){
      this.refreshActiveItemList();
      this.showHide_Value = "Show Inactive";
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Calls methods to edit selected Item
  editItemBtn(itemData: Items){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "300px";
    dialogConfig.data = itemData;

    this.dialog.open(EditItemDialogComponent, dialogConfig)
    .afterClosed().subscribe( val =>{
      if(val){
        console.log("item Edited", val);
        this.refreshTable(true);
        this.showHide_Value = "Show Inactive";
        this.openSnackBar('Item Successfully Updated!');
      }
      else{
        this.openSnackBar('Item Was Not Updated!');
      }
    })
  }

  // -----------------------------------------------------------------------------------------------------------
  //Displays message to the user
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
  // -----------------------------------------------------------------------------------------------------------


}

