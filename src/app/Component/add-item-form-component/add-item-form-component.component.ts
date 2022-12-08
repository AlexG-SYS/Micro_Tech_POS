import { Component, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from '../../Services/item.service';
import { NgForm } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Category {
  name: string;
}

@Component({
  selector: 'app-add-item-form-component',
  templateUrl: './add-item-form-component.component.html',
  styleUrls: ['./add-item-form-component.component.css']
})
export class AddItemFormComponentComponent {

  @Output() refreshActiveItemListEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("upcInput") searchField!: ElementRef;

  error = "";
  selectedFile: any = null;
  clicked = false;

  constructor(private itemService: ItemService, private snackBar: MatSnackBar, private changeDet: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }

  // -----------------------------------------------------------------------------------------------------------
  // Controls image input field
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Submit and Reset Form Functions
  onNewItemSubmit(formData: NgForm) {
    this.clicked = true;
    if (formData.valid) {

      const date = new Date().toLocaleDateString();
      const newItem = { ...formData.value } as Items;

      if(newItem.tax){
        newItem.itemTax = newItem.price * 0.125;
        newItem.itemSubTotal = newItem.price - newItem.itemTax;
      }
      else{
        newItem.itemTax = 0;
        newItem.itemSubTotal = newItem.price;
      }

      newItem.price = Number(newItem.price.toFixed(2));
      newItem.date = date;

      this.itemService.addItem(newItem, this.selectedFile)
        .pipe(
          tap(item => {
            console.log("Item Successfully Added! ID:", item.id);
            this.resetInput();
            formData.resetForm();
            this.refreshActiveItemListEvent.emit(true);
            this.openSnackBar('Item Successfully Added!', 'success-snakBar');
          }),
          catchError(error => {
            this.openSnackBar('An Error Occured While Saving!', 'error-snakBar');
            throw catchError(error);
          })
        ).subscribe();

      formData.resetForm();
      this.resetInput();
      this.clicked = false;
    }
    else {
      this.error = "Empty Fields*";
      this.clicked = false;
    }
  }

  resetInput() {
    this.selectedFile = null;
    this.error = "";
  }
  // -----------------------------------------------------------------------------------------------------------

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
