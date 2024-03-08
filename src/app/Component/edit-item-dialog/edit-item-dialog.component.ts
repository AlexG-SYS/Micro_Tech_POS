import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from 'src/app/Services/item.service';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Category {
  name: string;
}

@Component({
  selector: 'app-edit-item-dialog',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css'],
})
export class EditItemDialogComponent {
  itemForm!: FormGroup;
  item!: Items;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  categories: Category[] = [];

  error = '';
  clicked = false;
  isLoading = false;

  // -----------------------------------------------------------------------------------------------------------
  constructor(
    private dialogRef: MatDialogRef<EditItemDialogComponent>,
    private formB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) item: Items,
    private itemService: ItemService
  ) {
    // Initialize the form with item data
    this.item = item;
    this.itemForm = this.formB.group({
      upc: [item.upc, Validators.required],
      status: [item.status, Validators.required],
      description: [item.description, Validators.required],
      categories: [],
      size: [item.size, Validators.required],
      quantity: [item.quantity, Validators.required],
      cost: [item.cost, Validators.required],
      price: [item.price, Validators.required],
      tax: [item.tax, Validators.required],
      online: [item.online, Validators.required],
    });

    // Populate categories
    item.categories.forEach((catergory) => {
      this.categories.push({ name: catergory });
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Saves the changes
  tempArray: string[] = [];
  save() {
    this.clicked = true;
    this.isLoading = true;

    if (this.itemForm.valid) {
      const itemChanges = this.itemForm.value;

      // Prepare categories
      this.categories.forEach((element) => {
        this.tempArray.push(element.name.toLowerCase());
      });
      itemChanges.categories = this.tempArray;

      // Update item through ItemService
      this.itemService.updateItem(this.item.id, itemChanges).subscribe(() => {
        this.dialogRef.close(itemChanges);
      });
    } else {
      this.error = 'Invalid Input*';
      this.clicked = false;
      this.isLoading = false;
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Adds a category chip
  addMatChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add category if value is provided
    if (value) {
      this.categories.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Removes a category chip
  removeMatChip(category: Category): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }
  // -----------------------------------------------------------------------------------------------------------
}
