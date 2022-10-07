import { Component, Output, EventEmitter } from '@angular/core';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from '../../Services/item.service';
import { NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
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
  // Adds Chip functionality to Category Input Field
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  category: Category[] = [];

  addMatChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our category
    if (value) {
      this.category.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeMatChip(category: Category): void {
    const index = this.category.indexOf(category);

    if (index >= 0) {
      this.category.splice(index, 1);
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Controls image input field
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Submit and Reset Form Functions
  tempArray: string[] = [];
  onNewItemSubmit(formData: NgForm) {
    if (formData.valid) {

      const date = new Date().toLocaleDateString();
      const newItem = { ...formData.value } as Items;

      this.category.forEach(element => {
        this.tempArray.push(element.name.toLowerCase());
      });
      newItem.categories = this.tempArray;
      newItem.price = Number(newItem.price.toFixed(2));
      newItem.date = date;

      this.itemService.addItem(newItem, this.selectedFile)
        .pipe(
          tap(item => {
            console.log("Item Successfully Added! ID:", item.id);
            this.resetInput();
            formData.resetForm();
            this.refreshActiveItemListEvent.emit(true);
            this.openSnackBar('Item Successfully Added!');
          }),
          catchError(error => {
            console.log(error);
            this.openSnackBar('An Error Occured While Saving!');
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
    this.category = [];
    this.error = "";
    this.tempArray = [];
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  //Displays message to the user
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
  // -----------------------------------------------------------------------------------------------------------

}
