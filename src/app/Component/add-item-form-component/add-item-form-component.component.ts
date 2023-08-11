import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Items } from 'src/app/Data-Model/item';
import { ItemService } from '../../Services/item.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgForm } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Category {
  name: string;
}

@Component({
  selector: 'app-add-item-form-component',
  templateUrl: './add-item-form-component.component.html',
  styleUrls: ['./add-item-form-component.component.css'],
})
export class AddItemFormComponentComponent {
  // Event emitter to signal item list refresh to parent component
  @Output() refreshActiveItemListEvent: EventEmitter<boolean> =
    new EventEmitter();

  // Reference to the UPC input field
  @ViewChild('upcInput') searchField!: ElementRef;

  // Properties for error handling, file upload, chip functionality, and button click state
  error = '';
  selectedFile: any = null;
  clicked = false;
  category: Category[] = [];
  tempArray: string[] = [];

  // Separator keys for chip input field
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private changeDet: ChangeDetectorRef
  ) {}
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // After the view initialization, focus on the UPC input field
  ngAfterViewInit() {
    this.focusSearchField();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Focuses on the UPC input field
  private focusSearchField() {
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Adds a chip when input loses focus
  addOnBlur = true;

  addMatChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add a category
    if (value) {
      this.category.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Removes a chip
  removeMatChip(category: Category): void {
    const index = this.category.indexOf(category);

    if (index >= 0) {
      this.category.splice(index, 1);
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles form submission for adding a new item
  onNewItemSubmit(formData: NgForm) {
    this.clicked = true;

    if (formData.valid) {
      // Clone the form data to preserve original values
      const newItem = { ...formData.value } as Items;

      // Convert category names to lowercase
      this.category.forEach((element) => {
        this.tempArray.push(element.name.toLowerCase());
      });

      // Update item with categories and calculated tax/subtotal
      newItem.categories = this.tempArray;

      if (newItem.tax) {
        newItem.itemTax = newItem.price * 0.125;
        newItem.itemSubTotal = newItem.price - newItem.itemTax;
      } else {
        newItem.itemTax = 0;
        newItem.itemSubTotal = newItem.price;
      }

      newItem.price = Number(newItem.price.toFixed(2));
      newItem.date = new Date().toLocaleDateString();

      // Use the item service to add the new item
      this.itemService
        .addItem(newItem, this.selectedFile)
        .pipe(
          // Handle success case
          tap((item) => {
            this.handleSuccess(item.id);
            formData.resetForm();
            this.resetInput();
            this.clicked = false;
          }),
          // Handle error case
          catchError((error) => {
            this.handleError();
            return throwError(error); // Rethrow the error
          })
        )
        .subscribe();
    } else {
      // Handle invalid form input
      this.handleInvalidInput();
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Resets the input fields
  resetInput() {
    this.selectedFile = null;
    this.category = [];
    this.error = '';
    this.tempArray = [];
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Displays a message to the user using a snackbar
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles success after adding an item
  private handleSuccess(itemId: string) {
    console.log('Item Successfully Added! ID:', itemId);
    this.refreshActiveItemListEvent.emit(true);
    this.openSnackBar('Item Successfully Added!', 'success-snakBar');
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles errors during form submission
  private handleError() {
    this.openSnackBar('An Error Occurred While Saving!', 'error-snakBar');
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles invalid input in the form
  private handleInvalidInput() {
    this.error = 'Invalid Input*';
    this.clicked = false;
  }
  // -------------------------------------------------------------------------------------------------------------
}
