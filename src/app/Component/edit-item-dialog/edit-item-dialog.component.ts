import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from 'src/app/Services/item.service';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';

export interface Category {
  name: string;
}

@Component({
  selector: 'app-edit-item-dialog',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent {
  itemForm!: FormGroup;
  item!: Items;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  categories: Category[] = [];

  // Constructor Initialize FOrm Data
  constructor(private dialogRef: MatDialogRef<EditItemDialogComponent>, private formB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) item: Items, private itemService: ItemService) {

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
      online: [item.online, Validators.required]
    })

    item.categories.forEach(catergory => {
      this.categories.push({ name: catergory })
    })
  }

  // -----------------------------------------------------------------------------------------------------------
  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Executes when the save button is clicked. Calles the Item Update Funciton
  tempArray: string[] = [];
  save() {
    if (this.itemForm.valid) {
      const itemChanges = this.itemForm.value;

      this.categories.forEach(element => {
        this.tempArray.push(element.name.toLowerCase());
      });
      itemChanges.categories = this.tempArray;

      if (itemChanges.tax) {
        itemChanges.itemTax = itemChanges.price * 0.125;
        itemChanges.itemSubTotal = itemChanges.price - itemChanges.itemTax;
      }
      else {
        itemChanges.itemTax = 0;
        itemChanges.itemSubTotal = itemChanges.price;
      }

      this.itemService.updateItem(this.item.id, itemChanges).subscribe(() => {
        this.dialogRef.close(itemChanges);
      });
    }
  }
  // -----------------------------------------------------------------------------------------------------------


  // -----------------------------------------------------------------------------------------------------------
  // Adds Chip functionality to Category Input Field

  addMatChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our category
    if (value) {
      this.categories.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeMatChip(category: Category): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }
  // -----------------------------------------------------------------------------------------------------------

}
