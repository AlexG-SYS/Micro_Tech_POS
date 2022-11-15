import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from 'src/app/Services/item.service';

@Component({
  selector: 'app-edit-item-dialog',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent {
  itemForm!: FormGroup;
  item!: Items;

  // Constructor Initialize FOrm Data
  constructor(private dialogRef: MatDialogRef<EditItemDialogComponent>, private formB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) item: Items, private itemService: ItemService) {

    this.item = item;
    this.itemForm = this.formB.group({
      upc: [item.upc, Validators.required],
      status: [item.status, Validators.required],
      description: [item.description, Validators.required],
      quantity: [item.quantity, Validators.required],
      price: [item.price, Validators.required],
      category: [item.category, Validators.required],
      mpn: [item.mpn],
      tax: [item.tax, Validators.required],
      online: [item.online, Validators.required]
    })
  }

  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }

  // Executes when the save button is clicked. Calles the Item Update Funciton
  save() {
    if (this.itemForm.valid) {
      const itemChanges = this.itemForm.value;
      if(itemChanges.tax){
        itemChanges.itemTax = itemChanges.price * 0.125;
        itemChanges.itemSubTotal = itemChanges.price - itemChanges.itemTax;
      }
      else{
        itemChanges.itemTax = 0;
        itemChanges.itemSubTotal = itemChanges.price;
      }

      this.itemService.updateItem(this.item.id, itemChanges).subscribe(() => {
        this.dialogRef.close(itemChanges);
      });
    }
  }

}
