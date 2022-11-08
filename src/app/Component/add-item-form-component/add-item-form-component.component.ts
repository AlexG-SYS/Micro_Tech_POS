import { Component, Output, EventEmitter } from '@angular/core';
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

  error = "";
  selectedFile: any = null;

  constructor(private itemService: ItemService, private snackBar: MatSnackBar) {
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
    if (formData.valid) {

      const date = new Date().toLocaleDateString();
      const newItem = { ...formData.value } as Items;

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
    }
    else {
      this.error = "Empty Fields*";
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
